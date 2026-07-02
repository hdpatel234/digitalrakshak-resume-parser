import { prisma } from "@/lib/db/prisma";
import { Users, FileText, CreditCard, Activity } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardOverview() {
  const [userCount, parseCount, paymentCount, recentUsage] = await Promise.all([
    prisma.user.count(),
    prisma.resumeUpload.count({ where: { status: "COMPLETED" } }),
    prisma.payment.count({ where: { status: "COMPLETED" } }),
    prisma.clientUsageLog.findMany({ take: 5, orderBy: { createdAt: "desc" }, include: { tenant: true } })
  ]);

  const payments = await prisma.payment.findMany({ where: { status: "COMPLETED" } });
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-foreground">Platform Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border p-6 flex items-center">
          <div className="p-4 bg-primary/10 rounded-lg">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-muted-foreground">Total Users</p>
            <h3 className="text-2xl font-bold text-foreground">{userCount}</h3>
          </div>
        </div>

        <div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border p-6 flex items-center">
          <div className="p-4 bg-green-500/10 rounded-lg">
            <CreditCard className="w-8 h-8 text-green-500" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-muted-foreground">Gross Revenue</p>
            <h3 className="text-2xl font-bold text-foreground">₹{totalRevenue.toFixed(0)}</h3>
          </div>
        </div>

        <div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border p-6 flex items-center">
          <div className="p-4 bg-purple-500/10 rounded-lg">
            <FileText className="w-8 h-8 text-purple-500" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-muted-foreground">Resumes Parsed</p>
            <h3 className="text-2xl font-bold text-foreground">{parseCount}</h3>
          </div>
        </div>

        <div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border p-6 flex items-center">
          <div className="p-4 bg-orange-500/10 rounded-lg">
            <Activity className="w-8 h-8 text-orange-500" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-muted-foreground">Completed Payments</p>
            <h3 className="text-2xl font-bold text-foreground">{paymentCount}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-foreground">Recent API Activity</h3>
            <Link href="/admin/client-usage" className="text-sm text-primary hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {recentUsage.map(log => (
              <div key={log.id} className="flex justify-between items-center border-b border-border pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{log.tenant.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{log.endpoint}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{log.creditsUsed} Credits</p>
                  <p className="text-xs text-muted-foreground/70">{new Date(log.createdAt).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-muted/50 rounded-xl shadow-sm border border-border p-6 space-y-4">
          <h3 className="text-lg font-bold text-foreground">Quick Actions</h3>
          <Link href="/admin/plans" className="block w-full bg-card border border-border rounded-lg p-4 hover:border-primary transition">
            <h4 className="font-semibold text-foreground">Manage Subscription Plans</h4>
            <p className="text-sm text-muted-foreground">Update pricing and credit allocations</p>
          </Link>
          <Link href="/admin/providers" className="block w-full bg-card border border-border rounded-lg p-4 hover:border-primary transition">
            <h4 className="font-semibold text-foreground">Configure AI Providers</h4>
            <p className="text-sm text-muted-foreground">Manage Gemini, OpenAI, DeepSeek keys</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
