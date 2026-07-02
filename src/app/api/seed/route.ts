import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    let tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      tenant = await prisma.tenant.create({ data: { name: "Default Tenant" } });
    }

    const roleNames = ["super_admin", "admin", "user"];
    const roleMap: Record<string, string> = {};

    for (const roleName of roleNames) {
      let role = await prisma.role.findUnique({ where: { name: roleName } });
      if (!role) {
        role = await prisma.role.create({ data: { name: roleName } });
      }
      roleMap[roleName] = role.id;
    }

    const password = await bcrypt.hash("password123", 10);

    const adminEmail = "admin@digitalrakshak.com";
    let admin = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!admin) {
      admin = await prisma.user.create({
        data: {
          email: adminEmail,
          name: "Test Admin",
          password,
          tenantId: tenant.id,
          roleId: roleMap["super_admin"],
        },
      });
    }

    const clientEmail = "client@digitalrakshak.com";
    let client = await prisma.user.findUnique({ where: { email: clientEmail } });
    if (!client) {
      client = await prisma.user.create({
        data: {
          email: clientEmail,
          name: "Test Client",
          password,
          tenantId: tenant.id,
          roleId: roleMap["user"],
        },
      });
    }

    return NextResponse.json({ message: "Seeded successfully", admin, client });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
