import { providerRepository } from "../repositories/provider.repository";
import { encryptKey, decryptKey } from "@/lib/utils/encryption";

export class ProviderService {
  async getProviders() {
    const providers = await providerRepository.getProviders();
    
    // We should mask the API keys before sending them to the UI
    return providers.map(provider => ({
      ...provider,
      accounts: provider.accounts.map(account => ({
        ...account,
        apiKeys: account.apiKeys.map(key => ({
          ...key,
          keyEncrypted: "***HIDDEN***",
          // Provide a tiny hint of the original key if decrypted
          hint: this.getHint(key.keyEncrypted)
        }))
      }))
    }));
  }

  async getProviderById(id: string) {
    const provider = await providerRepository.getProviderById(id);
    if (!provider) return null;

    // Mask the API keys
    return {
      ...provider,
      accounts: provider.accounts.map(account => ({
        ...account,
        apiKeys: account.apiKeys.map(key => ({
          ...key,
          keyEncrypted: "***HIDDEN***",
          hint: this.getHint(key.keyEncrypted)
        }))
      }))
    };
  }

  async createProvider(name: string, isActive: boolean = true) {
    return providerRepository.createProvider({ name, isActive });
  }

  async toggleProvider(id: string, isActive: boolean) {
    return providerRepository.updateProviderStatus(id, isActive);
  }

  async addAccount(providerId: string, name: string) {
    return providerRepository.createAccount(providerId, name);
  }

  async addApiKey(data: {
    providerAccountId: string;
    rawKey: string;
    priority?: number;
    limitRequestsDaily?: number | null;
    limitRequestsPerMin?: number | null;
    limitRequestsPerHour?: number | null;
    limitRequestsPerMonth?: number | null;
  }) {
    const encryptedKey = encryptKey(data.rawKey);
    return providerRepository.createApiKey({
      providerAccountId: data.providerAccountId,
      keyEncrypted: encryptedKey,
      priority: data.priority,
      limitRequestsDaily: data.limitRequestsDaily,
      limitRequestsPerMin: data.limitRequestsPerMin,
      limitRequestsPerHour: data.limitRequestsPerHour,
      limitRequestsPerMonth: data.limitRequestsPerMonth
    });
  }

  // ---- Model Management ----

  async getModels() {
    return providerRepository.getModels();
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
    // Check if model already exists for this provider
    const providers = await providerRepository.getProviders();
    const targetProvider = providers.find(p => p.id === data.providerId);
    if (!targetProvider) throw new Error("Provider not found");

    if (targetProvider.models.some(m => m.modelName === data.modelName)) {
      throw new Error("Model already exists for this provider");
    }

    return providerRepository.createModel(data);
  }

  async updateModel(id: string, data: {
    isActive?: boolean;
    costPerRequest?: number;
    maxRequestsPerMin?: number | null;
    maxDailyLimit?: number | null;
    tokenLimit?: number | null;
  }) {
    return providerRepository.updateModel(id, data);
  }

  // System-level function to retrieve the raw key securely (do not expose to API routes!)
  async getRawKeyForProcessing(providerAccountId: string) {
    // We would need a custom repository fetch for this if we want to target a specific key
    // For now, it's an architecture placeholder for the parser
  }

  private getHint(encryptedKey: string) {
    try {
      const raw = decryptKey(encryptedKey);
      return `...${raw.slice(-4)}`;
    } catch {
      return "...";
    }
  }
}

export const providerService = new ProviderService();
