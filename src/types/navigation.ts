import type { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon;
  badge?: string;
  disabled?: boolean;
  external?: boolean;
  description?: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface SidebarNavItem extends NavItem {
  items?: NavItem[];
}
