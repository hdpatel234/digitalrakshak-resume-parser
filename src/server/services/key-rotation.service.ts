import { prisma } from "@/lib/db/prisma";
import { decryptKey } from "@/lib/utils/encryption";

export class KeyRotationService {
  /**
   * Retrieves the next available API key for the requested provider and model.
   * Ensures failover by checking limits and skipping exhausted keys.
   */
  async getAvailableKey(providerName: string, modelName: string) {
    const provider = await prisma.apiProvider.findUnique({
      where: { name: providerName },
      include: {
        models: { where: { modelName, isActive: true } },
        accounts: {
          where: { isActive: true },
          include: {
            apiKeys: {
              where: { isActive: true },
              orderBy: { priority: "desc" },
            },
          },
        },
      },
    });

    if (!provider || !provider.isActive) {
      throw new Error(`Provider ${providerName} is not active or found.`);
    }

    if (provider.models.length === 0) {
      throw new Error(`Model ${modelName} is not supported or active on ${providerName}.`);
    }

    const model = provider.models[0];
    const now = new Date();

    for (const account of provider.accounts) {
      for (const key of account.apiKeys) {
        // Automatically un-exhaust the key if its timeout has expired
        if (key.isExhausted && key.exhaustedResetAt && key.exhaustedResetAt < now) {
          await this.resetKeyStatus(key.id);
          key.isExhausted = false;
          key.usageCountMin = 0;
          key.usageCountHour = 0;
          key.usageCountDaily = 0;
          key.usageCountMonth = 0;
        }

        if (key.isExhausted) continue;

        // Verify time-based resets
        const needsMinReset = key.lastUsedAt && key.lastUsedAt.getMinutes() !== now.getMinutes() || (key.lastUsedAt && now.getTime() - key.lastUsedAt.getTime() > 60000);
        const needsHourReset = key.lastUsedAt && key.lastUsedAt.getHours() !== now.getHours() || (key.lastUsedAt && now.getTime() - key.lastUsedAt.getTime() > 3600000);
        const needsDailyReset = key.lastUsedAt && key.lastUsedAt.getDate() !== now.getDate() || (key.lastUsedAt && now.getTime() - key.lastUsedAt.getTime() > 86400000);
        const needsMonthReset = key.lastUsedAt && key.lastUsedAt.getMonth() !== now.getMonth();

        let currentMin = needsMinReset ? 0 : key.usageCountMin;
        let currentHour = needsHourReset ? 0 : key.usageCountHour;
        let currentDaily = needsDailyReset ? 0 : key.usageCountDaily;
        let currentMonth = needsMonthReset ? 0 : key.usageCountMonth;

        // Check Hard Limits
        const minLimitReached = key.limitRequestsPerMin !== null && currentMin >= key.limitRequestsPerMin;
        const hourLimitReached = key.limitRequestsPerHour !== null && currentHour >= key.limitRequestsPerHour;
        const dailyLimitReached = key.limitRequestsDaily !== null && currentDaily >= key.limitRequestsDaily;
        const monthLimitReached = key.limitRequestsPerMonth !== null && currentMonth >= key.limitRequestsPerMonth;

        if (monthLimitReached) {
          await this.reportKeyExhausted(key.id, "MONTH");
          continue;
        }

        if (dailyLimitReached) {
          await this.reportKeyExhausted(key.id, "DAY");
          continue;
        }

        if (hourLimitReached) {
          await this.reportKeyExhausted(key.id, "HOUR");
          continue;
        }

        if (minLimitReached) {
          await this.reportKeyExhausted(key.id, "MINUTE");
          continue;
        }

        // Key is valid! Return securely
        const rawKey = decryptKey(key.keyEncrypted);
        return {
          keyId: key.id,
          providerId: provider.id,
          modelId: model.id,
          provider: providerName,
          model: modelName,
          key: rawKey,
        };
      }
    }

    throw new Error(`All API keys for ${providerName} are currently exhausted or unavailable.`);
  }

  /**
   * Records a successful usage of the API key to increment counters and create a log.
   */
  async recordUsage(params: {
    keyId: string;
    providerId: string;
    modelId: string;
    tokensIn: number;
    tokensOut: number;
    cost: number;
    requestTimeMs?: number;
    isError?: boolean;
  }) {
    const key = await prisma.providerApiKey.findUnique({ where: { id: params.keyId } });
    if (!key) return;

    const now = new Date();
    const isNewMin = key.lastUsedAt && key.lastUsedAt.getMinutes() !== now.getMinutes() || (key.lastUsedAt && now.getTime() - key.lastUsedAt.getTime() > 60000);
    const isNewHour = key.lastUsedAt && key.lastUsedAt.getHours() !== now.getHours() || (key.lastUsedAt && now.getTime() - key.lastUsedAt.getTime() > 3600000);
    const isNewDay = key.lastUsedAt && key.lastUsedAt.getDate() !== now.getDate() || (key.lastUsedAt && now.getTime() - key.lastUsedAt.getTime() > 86400000);
    const isNewMonth = key.lastUsedAt && key.lastUsedAt.getMonth() !== now.getMonth();

    // Transaction to update counts and insert log
    await prisma.$transaction([
      prisma.providerApiKey.update({
        where: { id: params.keyId },
        data: {
          usageCountMin: isNewMin ? 1 : { increment: 1 },
          usageCountHour: isNewHour ? 1 : { increment: 1 },
          usageCountDaily: isNewDay ? 1 : { increment: 1 },
          usageCountMonth: isNewMonth ? 1 : { increment: 1 },
          lastUsedAt: now,
        },
      }),
      prisma.providerUsageLog.create({
        data: {
          providerId: params.providerId,
          modelId: params.modelId,
          apiKeyId: params.keyId,
          tokensIn: params.tokensIn,
          tokensOut: params.tokensOut,
          totalCost: params.cost,
          requestTimeMs: params.requestTimeMs,
          isError: params.isError || false
        }
      })
    ]);
  }

  /**
   * Forcefully marks a key as exhausted.
   */
  async reportKeyExhausted(keyId: string, duration: "MINUTE" | "HOUR" | "DAY" | "MONTH") {
    const now = new Date();
    let resetTime = new Date();

    if (duration === "MINUTE") {
      resetTime.setMinutes(resetTime.getMinutes() + 1);
    } else if (duration === "HOUR") {
      resetTime.setHours(resetTime.getHours() + 1);
      resetTime.setMinutes(0, 0, 0);
    } else if (duration === "DAY") {
      resetTime.setDate(resetTime.getDate() + 1);
      resetTime.setHours(0, 0, 0, 0);
    } else if (duration === "MONTH") {
      resetTime.setMonth(resetTime.getMonth() + 1);
      resetTime.setDate(1);
      resetTime.setHours(0, 0, 0, 0);
    }

    await prisma.providerApiKey.update({
      where: { id: keyId },
      data: {
        isExhausted: true,
        exhaustedResetAt: resetTime,
      },
    });
  }

  private async resetKeyStatus(keyId: string) {
    await prisma.providerApiKey.update({
      where: { id: keyId },
      data: {
        isExhausted: false,
        exhaustedResetAt: null,
        usageCountMin: 0,
        usageCountHour: 0,
        usageCountDaily: 0,
        usageCountMonth: 0,
      },
    });
  }
}

export const keyRotationService = new KeyRotationService();
