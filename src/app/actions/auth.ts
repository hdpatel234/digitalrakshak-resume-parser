"use server";

import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";
import { RegisterInput, registerSchema } from "@/schemas/auth";

export async function registerUser(data: RegisterInput) {
  try {
    const result = registerSchema.safeParse(data);
    if (!result.success) {
      return { error: "Invalid input data." };
    }

    const { name, email, password } = result.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "User with this email already exists." };
    }

    // Default tenant and role for new registrations
    let tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      tenant = await prisma.tenant.create({ data: { name: "Default Tenant" } });
    }

    let role = await prisma.role.findUnique({ where: { name: "user" } });
    if (!role) {
      role = await prisma.role.create({ data: { name: "user" } });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        tenantId: tenant.id,
        roleId: role.id,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Register Error:", error);
    return { error: "An error occurred during registration." };
  }
}
