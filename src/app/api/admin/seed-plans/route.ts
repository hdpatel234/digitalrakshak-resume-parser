import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: Request) {
  try {
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

    return NextResponse.json({ success: true, message: "Plans seeded successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
