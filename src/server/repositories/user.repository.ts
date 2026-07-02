import { prisma } from "@/lib/db/prisma";

export class UserRepository {
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: { email: string; name?: string; tenantId: string; roleId: string }) {
    return prisma.user.create({
      data,
    });
  }
}

export const userRepository = new UserRepository();
