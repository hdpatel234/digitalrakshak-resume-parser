import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

export class AuthService {
  async registerUser(email: string, passwordRaw: string, name?: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(passwordRaw, 10);

    // For a real SaaS, we need to handle Tenant and Role assignment here.
    // Assuming we fetch the default 'CLIENT' role:
    let clientRole = await prisma.role.findUnique({ where: { name: "client" } });
    if (!clientRole) {
      clientRole = await prisma.role.create({ data: { name: "client" } });
    }

    // Creating a new tenant for the new user
    const tenant = await prisma.tenant.create({
      data: {
        name: `${name || "New"}'s Workspace`,
      },
    });

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        tenantId: tenant.id,
        roleId: clientRole.id,
      },
    });

    return user;
  }

  async generateVerificationToken(email: string) {
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Delete existing token if any
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    const verificationToken = await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // Send email logic would go here (e.g. nodemailer, resend)

    return verificationToken;
  }
}

export const authService = new AuthService();
