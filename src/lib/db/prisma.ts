// Mock Prisma Client to prevent build errors after removing database dependencies
const createMockModel = (mockData: Record<string, any>[] = []) => ({
  findMany: async (): Promise<Record<string, any>[]> => mockData,
  findUnique: async (): Promise<Record<string, any> | null> => mockData[0] || null,
  findFirst: async (): Promise<Record<string, any> | null> => mockData[0] || null,
  create: async (): Promise<Record<string, any>> => ({ id: "mock-id" }),
  update: async (): Promise<Record<string, any>> => ({ id: "mock-id" }),
  delete: async (): Promise<Record<string, any>> => ({ id: "mock-id" }),
  count: async (): Promise<number> => mockData.length,
});

export const prisma: any = {
  wallet: createMockModel([{ balance: 150 }]),
  subscription: createMockModel([{ plan: { name: "Pro Plan" }, currentPeriodEnd: new Date() }]),
  resumeUpload: createMockModel([]),
  payment: createMockModel([]),
  user: createMockModel([]),
  plan: createMockModel([{ id: 'p1', name: 'Free', priceId: 'price_free', type: 'subscription' }]),
  provider: createMockModel([{ id: 'prov1', name: 'Gemini', type: 'gemini', isActive: true }]),
  apiStats: createMockModel([]),
  clientUsage: createMockModel([]),
};
