// Mock Auth to prevent build errors
export const auth = async () => ({
  user: {
    tenantId: "mock-tenant-id",
    role: "super_admin",
    name: "Mock User",
    email: "mock@example.com"
  }
});

export const signIn = async () => {};
export const signOut = async () => {};
