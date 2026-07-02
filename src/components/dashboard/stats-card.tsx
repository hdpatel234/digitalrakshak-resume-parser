import {
  IndianRupee,
  Users,
  TrendingUp,
  FolderOpen,
  Activity,
  Zap,
  ShieldCheck,
  FileJson,
  CreditCard,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StatCard as StatCardType } from "@/types/dashboard";

const iconMap: Record<string, React.ElementType> = {
  "indian-rupee": IndianRupee,
  users: Users,
  "trending-up": TrendingUp,
  "folder-open": FolderOpen,
  activity: Activity,
  zap: Zap,
  "shield-check": ShieldCheck,
  "file-json": FileJson,
  "credit-card": CreditCard,
  "check-circle": CheckCircle,
};

interface StatsCardProps {
  stat: StatCardType;
}

export function StatsCard({ stat }: StatsCardProps) {
  const Icon = iconMap[stat.icon] || Activity;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {stat.title}
        </CardTitle>
        <div className="rounded-lg bg-gradient-to-br from-indigo-500/10 to-violet-500/10 p-2">
          <Icon className="h-4 w-4 text-indigo-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stat.value}</div>
        <p
          className={`text-xs mt-1 ${
            stat.changeType === "positive"
              ? "text-emerald-500"
              : stat.changeType === "negative"
              ? "text-red-500"
              : "text-muted-foreground"
          }`}
        >
          {stat.change} from last month
        </p>
      </CardContent>
    </Card>
  );
}
