import { NextResponse } from "next/server";
import { dashboardStats } from "@/data/stats";

export async function GET() {
  try {
    // Simulate API fetch delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Return realistic mock user dashboard stats
    return NextResponse.json({
      success: true,
      data: {
        kpis: dashboardStats,
        usageInfo: {
          currentPlan: "Pro",
          billingCycleEnd: "2024-11-01T00:00:00Z",
          creditsTotal: 10000,
          creditsUsed: 7200,
        },
        recentActivity: [
          { id: "act_1", action: "Parsed resume", details: "alex_johnson_resume.pdf", timestamp: "2024-10-15T14:32:00Z" },
          { id: "act_2", action: "Bulk upload initiated", details: "batch_engineering_hires.zip", timestamp: "2024-10-14T09:15:00Z" },
          { id: "act_3", action: "Generated API Key", details: "Production Key v2", timestamp: "2024-10-10T11:20:00Z" },
        ]
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch user dashboard data" },
      { status: 500 }
    );
  }
}
