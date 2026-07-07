// Mock Prisma Client to prevent build errors after removing database dependencies
const createMockModel = (mockData: any[] = []) => ({
  findMany: async () => mockData,
  findUnique: async () => mockData[0] || null,
  findFirst: async () => mockData[0] || null,
  create: async () => ({ id: "mock-id" }),
  update: async () => ({ id: "mock-id" }),
  delete: async () => ({ id: "mock-id" }),
  count: async () => mockData.length,
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
