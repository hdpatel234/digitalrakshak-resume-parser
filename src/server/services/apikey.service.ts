import crypto from "crypto";
import { prisma } from "@/lib/db/prisma";
import { billingService } from "./billing.service";

const RATE_LIMIT_MAX_RPM = 60; // 60 requests per minute

export class ApiKeyService {
  /**
   * Generates a new cryptographically secure API key for external clients.
   */
  async generateKey(tenantId: string, name: string) {
    const rawKey = `sk_live_${crypto.randomBytes(32).toString("hex")}`;
    
    const key = await prisma.apiKey.create({
      data: {
        tenantId,
        name,
        key: rawKey,
        isActive: true
      }
    });

    return key;
  }

  /**
   * Retrieves all keys for a tenant
   */
  async getKeys(tenantId: string) {
    return prisma.apiKey.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" }
    });
  }

  /**
   * Deactivates a specific key
   */
  async deactivateKey(id: string, tenantId: string) {
    return prisma.apiKey.updateMany({
      where: { id, tenantId },
      data: { isActive: false }
    });
  }

  /**
   * The core validation engine for the public API.
   * Checks token validity, subscription status, wallet credits, and rate limits.
   */
  async validateApiKey(token: string, costCredits: number = 1) {
    // 1. Authenticate Token
    const apiKey = await prisma.apiKey.findUnique({
      where: { key: token },
      include: { tenant: true }
    });

    if (!apiKey || !apiKey.isActive) {
      throw new Error("Invalid or inactive API Key.");
    }

    const tenantId = apiKey.tenantId;

    // 2. Check Subscription Status
    const subscription = await prisma.subscription.findFirst({
      where: { tenantId, status: "ACTIVE" }
    });

    if (!subscription) {
      throw new Error("Active subscription required to access the API.");
    }

    // 3. Check Wallet Credits
    const hasCredits = await billingService.hasSufficientCredits(tenantId, costCredits);
    if (!hasCredits) {
      throw new Error("Insufficient credits in wallet.");
    }

    // 4. Rate Limiter (DB based for prototype)
    const oneMinuteAgo = new Date();
    oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1);

    const recentRequests = await prisma.clientUsageLog.count({
      where: {
        apiKeyId: apiKey.id,
        createdAt: { gte: oneMinuteAgo }
      }
    });

    if (recentRequests >= RATE_LIMIT_MAX_RPM) {
      throw new Error("Rate limit exceeded. Maximum 60 requests per minute.");
    }

    // Update Last Used Timestamp
    await prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() }
    });

    return apiKey;
  }

  /**
   * Logs API usage strictly tied to an API key.
   */
  async logUsage(tenantId: string, apiKeyId: string, endpoint: string, creditsUsed: number) {
    await prisma.clientUsageLog.create({
      data: {
        tenantId,
        apiKeyId,
        endpoint,
        creditsUsed
      }
    });
  }
}

export const apiKeyService = new ApiKeyService();
