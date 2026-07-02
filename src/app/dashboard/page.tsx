import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import Link from "next/link";
import { Wallet, Package, ArrowUpCircle, FileText, Activity } from "lucide-react";

export default async function DashboardOverview() {
  const session = await auth();
  if (!session || !session.user) return null;

  const tenantId = (session.user as any).tenantId;

  // 1. Fetch Wallet Balance
  const wallet = await prisma.wallet.findUnique({ where: { tenantId } });
  const remainingCredits = wallet?.balance || 0;

  // 2. Fetch Active Subscription
  const subscription = await prisma.subscription.findFirst({
    where: { tenantId, status: "ACTIVE" },
    include: { plan: true }
  });

  // 3. Fetch Parse Stats
  const parseCount = await prisma.resumeUpload.count({
    where: { tenantId, status: "COMPLETED" }
  });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Plan */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-6 text-card-foreground">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Package className="w-5 h-5" /> Current Plan
            </h3>
            <Link href="/pricing" className="text-sm text-primary hover:underline flex items-center gap-1">
              <ArrowUpCircle className="w-4 h-4" /> Upgrade
            </Link>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {subscription ? subscription.plan.name : "Free Tier"}
          </p>
          {subscription && (
            <p className="text-xs text-muted-foreground mt-2">
              Renews on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Remaining Credits */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-6 text-card-foreground">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Wallet className="w-5 h-5" /> Remaining Credits
            </h3>
          </div>
          <p className="text-2xl font-bold text-foreground">{remainingCredits}</p>
          <div className="w-full bg-muted rounded-full h-2 mt-4">
            <div className="bg-primary h-2 rounded-full" style={{ width: "100%" }}></div>
          </div>
        </div>

        {/* Total Parses */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-6 text-card-foreground">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="w-5 h-5" /> Successful Parses
            </h3>
          </div>
          <p className="text-2xl font-bold text-foreground">{parseCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-primary/10 rounded-xl p-6 border border-primary/20 flex items-start justify-between">
          <div>
            <h4 className="text-lg font-semibold text-foreground">API Access Ready</h4>
            <p className="text-muted-foreground mt-2 text-sm">Integrate our parsing engine directly into your own software using our developer API.</p>
          </div>
          <Link href="/dashboard/api-keys" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition">
            Generate Keys
          </Link>
        </div>
        
        <div className="bg-muted/50 rounded-xl p-6 border border-border flex items-start justify-between">
          <div>
            <h4 className="text-lg font-semibold text-foreground">View Analytics</h4>
            <p className="text-muted-foreground mt-2 text-sm">Track your API consumption and monitor usage spikes over time.</p>
          </div>
          <Link href="/dashboard/usage" className="bg-card text-foreground border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition flex items-center gap-2">
            <Activity className="w-4 h-4" /> Usage
          </Link>
        </div>
      </div>
    </div>
  );
}
