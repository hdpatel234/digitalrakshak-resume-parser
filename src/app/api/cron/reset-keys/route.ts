import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

/**
 * Triggered via Vercel Cron or another scheduler.
 * This route forces a bulk database cleanup of usage counters and exhausted statuses.
 */
export async function GET(req: Request) {
  // Very basic security check for external cron runners
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized cron trigger" }, { status: 401 });
  }

  const now = new Date();

  try {
    // 1. Un-exhaust keys whose timeout has expired
    await prisma.providerApiKey.updateMany({
      where: {
        isExhausted: true,
        exhaustedResetAt: { lte: now }
      },
      data: {
        isExhausted: false,
        exhaustedResetAt: null
      }
    });

    // 2. Clean up Daily Limits
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    await prisma.providerApiKey.updateMany({
      where: {
        lastUsedAt: { lt: startOfToday },
        usageCountDaily: { gt: 0 }
      },
      data: {
        usageCountDaily: 0
      }
    });

    // 3. Clean up Monthly Limits
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    await prisma.providerApiKey.updateMany({
      where: {
        lastUsedAt: { lt: startOfMonth },
        usageCountMonth: { gt: 0 }
      },
      data: {
        usageCountMonth: 0
      }
    });

    return NextResponse.json({ success: true, message: "Keys successfully reset." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
