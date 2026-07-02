import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Simulate API fetch delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Return realistic mock admin dashboard stats
    return NextResponse.json({
      success: true,
      data: {
        platformMetrics: {
          totalUsers: 1248,
          activeUsers30d: 892,
          mrr: 42500,
          totalResumesParsed: 1280000,
          systemUptimePercent: 99.99,
          averageLatencyMs: 120,
        },
        recentSignups: [
          { id: "usr_101", name: "Alex Johnson", email: "alex.j@example.com", plan: "Pro", joinedAt: "2024-10-15T09:00:00Z" },
          { id: "usr_104", name: "Priya Patel", email: "priya.p@example.com", plan: "Free", joinedAt: "2024-10-14T15:30:00Z" },
        ],
        systemAlerts: [
          { id: "alt_1", severity: "high", message: "Database CPU spike detected", timestamp: "2024-10-15T10:20:00Z" },
          { id: "alt_2", severity: "low", message: "Daily backup completed successfully", timestamp: "2024-10-15T02:00:00Z" },
        ]
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch admin dashboard data" },
      { status: 500 }
    );
  }
}
