import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient({})

async function main() {
  console.log('Seeding baseline subscription plans...')

  const plans = [
    {
      name: 'Starter',
      price: 499,
      currency: 'INR',
      credits: 500,
      features: { description: 'Perfect for individuals and freelancers' }
    },
    {
      name: 'Growth',
      price: 1499,
      currency: 'INR',
      credits: 2500,
      features: { description: 'Ideal for small recruiting agencies' }
    },
    {
      name: 'Pro',
      price: 4999,
      currency: 'INR',
      credits: 10000,
      features: { description: 'Built for high volume HR departments' }
    },
    {
      name: 'Business',
      price: 14999,
      currency: 'INR',
      credits: 50000,
      features: { description: 'Enterprise-grade scale and priority support' }
    }
  ]

  for (const plan of plans) {
    // Upsert to avoid duplicates if run multiple times
    await prisma.plan.upsert({
      where: { name: plan.name },
      update: {
        price: plan.price,
        credits: plan.credits,
        currency: plan.currency,
        features: plan.features
      },
      create: plan
    })
  }

  console.log('Plans seeded successfully.')

  console.log('Seeding roles and test users...')
  
  // Create default tenant
  let tenant = await prisma.tenant.findFirst();
  if (!tenant) {
    tenant = await prisma.tenant.create({ data: { name: "Default Tenant" } });
  }

  // Create roles
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

  // Admin User
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
    console.log("Created admin user:", adminEmail);
  } else {
    console.log("Admin user already exists");
  }

  // Client User
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
    console.log("Created client user:", clientEmail);
  } else {
    console.log("Client user already exists");
  }

}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
