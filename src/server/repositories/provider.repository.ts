import { prisma } from "@/lib/db/prisma";

export class ProviderRepository {
  async getProviders() {
    return prisma.apiProvider.findMany({
      include: {
        models: true,
        accounts: {
          include: {
            apiKeys: true
          }
        }
      }
    });
  }

  async getProviderById(id: string) {
    return prisma.apiProvider.findUnique({
      where: { id },
      include: {
        models: true,
        accounts: {
          include: {
            apiKeys: true
          }
        }
      }
    });
  }

  async createProvider(data: { name: string; isActive?: boolean }) {
    return prisma.apiProvider.create({
      data,
    });
  }

  async updateProviderStatus(id: string, isActive: boolean) {
    return prisma.apiProvider.update({
      where: { id },
      data: { isActive }
    });
  }

  async createAccount(providerId: string, name: string) {
    return prisma.providerAccount.create({
      data: {
        providerId,
        name,
      }
    });
  }

  async createApiKey(data: {
    providerAccountId: string;
    keyEncrypted: string;
    priority?: number;
    limitRequestsDaily?: number | null;
    limitRequestsPerMin?: number | null;
    limitRequestsPerHour?: number | null;
    limitRequestsPerMonth?: number | null;
  }) {
    return prisma.providerApiKey.create({
      data: {
        providerAccountId: data.providerAccountId,
        keyEncrypted: data.keyEncrypted,
        priority: data.priority || 0,
        limitRequestsDaily: data.limitRequestsDaily,
        limitRequestsPerMin: data.limitRequestsPerMin,
        limitRequestsPerHour: data.limitRequestsPerHour,
        limitRequestsPerMonth: data.limitRequestsPerMonth,
      }
    });
  }

  // ---- Model Management Methods ----
  
  async getModels() {
    return prisma.providerModel.findMany({
      include: {
        provider: true
      }
    });
  }

  async getModelById(id: string) {
    return prisma.providerModel.findUnique({
      where: { id },
      include: {
        provider: true
      }
    });
  }

  async createModel(data: {
    providerId: string;
    modelName: string;
    costPerRequest?: number;
    maxRequestsPerMin?: number;
    maxDailyLimit?: number;
    tokenLimit?: number;
    isActive?: boolean;
  }) {
    return prisma.providerModel.create({
      data: {
        providerId: data.providerId,
        modelName: data.modelName,
        costPerRequest: data.costPerRequest || 0,
        maxRequestsPerMin: data.maxRequestsPerMin,
        maxDailyLimit: data.maxDailyLimit,
        tokenLimit: data.tokenLimit,
        isActive: data.isActive !== undefined ? data.isActive : true
      }
    });
  }

  async updateModel(id: string, data: {
    isActive?: boolean;
    costPerRequest?: number;
    maxRequestsPerMin?: number | null;
    maxDailyLimit?: number | null;
    tokenLimit?: number | null;
  }) {
    return prisma.providerModel.update({
      where: { id },
      data
    });
  }
}

export const providerRepository = new ProviderRepository();
