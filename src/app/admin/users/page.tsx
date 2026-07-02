"use client";

import { useState, useMemo } from "react";
import { 
  Users as UsersIcon, 
  Search, 
  Filter,
  MoreVertical,
  Edit,
  Ban,
  Trash2,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { mockAdminUsers, type AdminUser, type UserStatus, type UserPlan } from "@/data/mock-users";
import { cn } from "@/lib/utils";

// ─── Status & Plan Helpers ──────────────────────────────────────────────────

const statusConfig: Record<UserStatus, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  active: { label: "Active", variant: "default" },
  suspended: { label: "Suspended", variant: "destructive" },
  pending: { label: "Pending", variant: "secondary" },
};

function StatusBadge({ status }: { status: UserStatus }) {
  const cfg = statusConfig[status];
  return (
    <Badge 
      variant={cfg.variant} 
      className={cn(status === "active" && "bg-emerald-500 hover:bg-emerald-600")}
    >
      {cfg.label}
    </Badge>
  );
}

function PlanBadge({ plan }: { plan: UserPlan }) {
  const styles = {
    Starter: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    Pro: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    Enterprise: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    Free: "bg-muted text-muted-foreground border-border",
  };
  return (
    <Badge variant="outline" className={cn("font-medium border", styles[plan])}>
      {plan}
    </Badge>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(mockAdminUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");
  const [planFilter, setPlanFilter] = useState<UserPlan | "all">("all");

  // Filter Logic
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      const matchesPlan = planFilter === "all" || user.plan === planFilter;
      
      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [users, searchQuery, statusFilter, planFilter]);

  // Action Handlers
  const handleSuspend = (id: string, currentStatus: UserStatus) => {
    setUsers((prev) => prev.map((u) => {
      if (u.id === id) {
        const newStatus = currentStatus === "suspended" ? "active" : "suspended";
        toast.success(`User ${newStatus === "active" ? "activated" : "suspended"} successfully.`);
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  const handleDelete = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast.success("User deleted successfully.");
  };

  // Table Columns Definition
  const columns = [
    {
      header: "User",
      accessorKey: "name",
      className: "w-[250px]",
      cell: (u: AdminUser) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 rounded-md shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium rounded-md">
              {u.name.charAt(0)}{u.name.split(" ")[1]?.[0] || ""}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">{u.name}</p>
            <p className="text-xs text-muted-foreground truncate">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Plan",
      accessorKey: "plan",
      className: "hidden md:table-cell",
      cell: (u: AdminUser) => <PlanBadge plan={u.plan} />,
    },
    {
      header: "Credits",
      accessorKey: "creditsRemaining",
      className: "hidden sm:table-cell text-right",
      cell: (u: AdminUser) => (
        <span className="font-mono text-sm">
          {u.creditsRemaining > 900000 ? "Unlimited" : u.creditsRemaining.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Total Parsed",
      accessorKey: "totalParsed",
      className: "hidden lg:table-cell text-right",
      cell: (u: AdminUser) => (
        <span className="text-sm font-medium text-muted-foreground">
          {u.totalParsed.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (u: AdminUser) => <StatusBadge status={u.status} />,
    },
    {
      header: "",
      accessorKey: "actions",
      className: "w-[50px] pr-4",
      cell: (u: AdminUser) => (
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
              <MoreVertical className="w-4 h-4" />
              <span className="sr-only">Actions</span>
            </Button>
          } />
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <Edit className="w-4 h-4 mr-2" /> Edit User
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer"
              onClick={() => handleSuspend(u.id, u.status)}
            >
              {u.status === "suspended" ? (
                <><CheckCircle2 className="w-4 h-4 mr-2" /> Activate</>
              ) : (
                <><Ban className="w-4 h-4 mr-2" /> Suspend</>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={() => handleDelete(u.id)}
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage your customer accounts, plans, and platform access.
          </p>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3 border-b border-border/40 mb-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <UsersIcon className="w-5 h-5 text-primary" />
              Platform Users
              <Badge variant="secondary" className="ml-2 bg-muted">{filteredUsers.length}</Badge>
            </div>
            
            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative w-full sm:w-[250px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-9 h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                {/* Minimal pseudo-selects using DropdownMenu for filters to avoid heavy dependencies, keeping it clean */}
                <DropdownMenu>
                  <DropdownMenuTrigger render={
                    <Button variant="outline" size="sm" className="h-9 gap-2">
                      <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="hidden xl:inline">Status:</span>
                      <span className="capitalize">{statusFilter}</span>
                    </Button>
                  } />
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Statuses</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("active")}>Active</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("suspended")}>Suspended</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger render={
                    <Button variant="outline" size="sm" className="h-9 gap-2">
                      <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="hidden xl:inline">Plan:</span>
                      <span className="capitalize">{planFilter}</span>
                    </Button>
                  } />
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setPlanFilter("all")}>All Plans</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPlanFilter("Enterprise")}>Enterprise</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPlanFilter("Pro")}>Pro</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPlanFilter("Starter")}>Starter</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPlanFilter("Free")}>Free</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <DataTable 
            columns={columns} 
            data={filteredUsers}
            emptyTitle="No users found"
            emptyDescription="Try adjusting your search or filters to find what you're looking for."
            className="border-0 shadow-none rounded-none"
          />
        </CardContent>
      </Card>
    </div>
  );
}
