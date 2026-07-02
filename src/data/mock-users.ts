export type UserPlan = "Starter" | "Pro" | "Enterprise" | "Free";
export type UserStatus = "active" | "suspended" | "pending";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  plan: UserPlan;
  creditsRemaining: number;
  status: UserStatus;
  totalParsed: number;
  avatarUrl?: string;
  joinedAt: string;
}

export const mockAdminUsers: AdminUser[] = [
  {
    id: "usr_101",
    name: "Alex Johnson",
    email: "alex.j@example.com",
    plan: "Pro",
    creditsRemaining: 8500,
    status: "active",
    totalParsed: 12450,
    joinedAt: "2023-01-15",
  },
  {
    id: "usr_102",
    name: "Samantha Lee",
    email: "s.lee99@example.com",
    plan: "Enterprise",
    creditsRemaining: 999999, // unlimited
    status: "active",
    totalParsed: 45200,
    joinedAt: "2022-11-04",
  },
  {
    id: "usr_103",
    name: "Michael Chen",
    email: "mchen@example.com",
    plan: "Starter",
    creditsRemaining: 120,
    status: "active",
    totalParsed: 880,
    joinedAt: "2024-02-20",
  },
  {
    id: "usr_104",
    name: "Priya Patel",
    email: "priya.p@example.com",
    plan: "Free",
    creditsRemaining: 0,
    status: "suspended",
    totalParsed: 100,
    joinedAt: "2024-05-10",
  },
  {
    id: "usr_105",
    name: "David Kim",
    email: "dkim_dev@example.com",
    plan: "Pro",
    creditsRemaining: 4200,
    status: "active",
    totalParsed: 5800,
    joinedAt: "2023-08-12",
  },
  {
    id: "usr_106",
    name: "Emma Wilson",
    email: "emma.w@example.com",
    plan: "Starter",
    creditsRemaining: 800,
    status: "pending",
    totalParsed: 200,
    joinedAt: "2024-10-25",
  },
  {
    id: "usr_107",
    name: "James Miller",
    email: "jmiller@techcorp.com",
    plan: "Enterprise",
    creditsRemaining: 999999,
    status: "active",
    totalParsed: 125000,
    joinedAt: "2021-06-30",
  },
  {
    id: "usr_108",
    name: "Olivia Davis",
    email: "olivia.d@example.com",
    plan: "Free",
    creditsRemaining: 50,
    status: "active",
    totalParsed: 50,
    joinedAt: "2024-09-18",
  },
];
