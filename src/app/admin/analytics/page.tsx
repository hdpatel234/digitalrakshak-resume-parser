"use client";

import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  BrainCircuit,
  BarChart3,
  PieChart as PieChartIcon
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// ─── Dummy Analytics Data ──────────────────────────────────────────────────

const usageGrowthData = [
  { month: "Jan", usage: 12000 },
  { month: "Feb", usage: 19000 },
  { month: "Mar", usage: 35000 },
  { month: "Apr", usage: 48000 },
  { month: "May", usage: 65000 },
  { month: "Jun", usage: 89000 },
];

const parsingErrorsData = [
  { reason: "Corrupted PDF", count: 450 },
  { reason: "Timeout", count: 320 },
  { reason: "Unsupported Format", count: 210 },
  { reason: "File Too Large", count: 180 },
  { reason: "Other", count: 90 },
];

const fileTypeData = [
  { name: "PDF", value: 65, color: "#3b82f6" }, // blue-500
  { name: "DOCX", value: 25, color: "#8b5cf6" }, // violet-500
  { name: "DOC", value: 8, color: "#ec4899" }, // pink-500
  { name: "TXT", value: 2, color: "#f59e0b" }, // amber-500
];

const topSkills = [
  { name: "JavaScript / TypeScript", count: 45200 },
  { name: "React / Next.js", count: 38100 },
  { name: "Python", count: 31500 },
  { name: "Node.js", count: 29800 },
  { name: "AWS", count: 24300 },
];

// ─── Main Component ─────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Platform Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Detailed metrics and usage statistics across the entire parsing engine.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Processed</CardTitle>
            <FileText className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.28M</div>
            <p className="text-xs text-muted-foreground mt-1">+14% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.1%</div>
            <p className="text-xs text-muted-foreground mt-1">+0.2% from last month</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Failed Parses</CardTitle>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.4K</div>
            <p className="text-xs text-muted-foreground mt-1">Primarily corrupted PDFs</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Parsing Time</CardTitle>
            <Clock className="w-4 h-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2s</div>
            <p className="text-xs text-muted-foreground mt-1">-0.3s from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Usage Growth Chart */}
        <Card className="shadow-sm lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <CardTitle>Usage Growth</CardTitle>
            </div>
            <CardDescription>Total resumes parsed across all accounts over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={usageGrowthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    tickFormatter={(val) => `${val / 1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
                    itemStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="usage" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ r: 4, fill: "hsl(var(--background))", strokeWidth: 2 }}
                    activeDot={{ r: 6, strokeWidth: 0, fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Skills Detected */}
        <Card className="shadow-sm lg:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-primary" />
              <CardTitle>Top Skills Detected</CardTitle>
            </div>
            <CardDescription>Most frequently extracted skills.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5 mt-2">
              {topSkills.map((skill, index) => (
                <div key={skill.name} className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-6 h-6 rounded bg-primary/10 text-primary text-xs font-bold shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-medium truncate">{skill.name}</p>
                      <span className="text-xs text-muted-foreground shrink-0">{skill.count.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary/70 rounded-full" 
                        style={{ width: `${(skill.count / topSkills[0].count) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Parsing Errors Chart */}
        <Card className="shadow-sm lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <CardTitle>Parsing Error Distribution</CardTitle>
            </div>
            <CardDescription>Categorized breakdown of the {usageGrowthData[5].usage > 1000 ? "recent" : ""} failed parses.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={parsingErrorsData} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="reason" 
                    type="category" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <Tooltip 
                    cursor={{ fill: "hsl(var(--muted)/0.3)" }}
                    contentStyle={{ backgroundColor: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--destructive))" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* File Type Distribution */}
        <Card className="shadow-sm lg:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-primary" />
              <CardTitle>File Formats</CardTitle>
            </div>
            <CardDescription>Processed resume file types.</CardDescription>
          </CardHeader>
          <CardContent className="pb-0">
            <div className="h-[220px] w-full -mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fileTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {fileTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
                    formatter={(value: any) => [`${value}%`, "Share"]}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                    formatter={(value) => <span className="text-xs text-muted-foreground mr-3">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
