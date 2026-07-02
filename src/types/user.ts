export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  plan: SubscriptionPlan;
  createdAt: string;
  lastLoginAt: string;
  isActive: boolean;
}

export type UserRole = "user" | "admin" | "super_admin";

export type SubscriptionPlan = "free" | "pro" | "enterprise";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  company?: string;
  location?: string;
  website?: string;
  phone?: string;
}
