const createMockModel = (mockData: Record<string, any>[] = []) => ({
  findMany: async (...args: any[]): Promise<Record<string, any>[]> => mockData,
  findUnique: async (...args: any[]): Promise<Record<string, any> | null> => mockData[0] || null,
  findFirst: async (...args: any[]): Promise<Record<string, any> | null> => mockData[0] || null,
  create: async (...args: any[]): Promise<Record<string, any>> => ({ id: "mock-id" }),
  update: async (...args: any[]): Promise<Record<string, any>> => ({ id: "mock-id" }),
  delete: async (...args: any[]): Promise<Record<string, any>> => ({ id: "mock-id" }),
  count: async (...args: any[]): Promise<number> => mockData.length,
});

type MockModel = ReturnType<typeof createMockModel>;

export const prisma: Record<string, MockModel> = {
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
