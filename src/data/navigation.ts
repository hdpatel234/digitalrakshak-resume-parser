import {
  LayoutDashboard,
  Settings,
  CreditCard,
  Users,
  BarChart3,
  UploadCloud,
  FileJson,
  Files,
  Key,
  Database,
  Activity,
  CreditCard as CreditCardIcon,
  LifeBuoy,
  Briefcase,
} from "lucide-react";
import type { NavItem, NavGroup } from "@/types/navigation";

export const marketingNav: NavItem[] = [
  { title: "Features", href: "/#features" },
  { title: "Pricing", href: "/#pricing" },
  { title: "About", href: "/#about" },
];

export const dashboardNav: NavGroup[] = [
  {
    title: "Core",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Upload Resume",
        href: "/dashboard/upload",
        icon: UploadCloud,
      },
      {
        title: "Parsed Resumes",
        href: "/dashboard/resumes",
        icon: FileJson,
      }
    ],
  },
  {
    title: "Developer",
    items: [
      {
        title: "API Keys",
        href: "/dashboard/api-keys",
        icon: Key,
      },
      {
        title: "Usage Analytics",
        href: "/dashboard/usage",
        icon: Activity,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Billing",
        href: "/dashboard/billing",
        icon: CreditCard,
      }
    ],
  },
];

export const adminNav: NavGroup[] = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      },
      {
        title: "Revenue",
        href: "/admin/revenue",
        icon: CreditCard,
      },
    ],
  },
  {
    title: "Core Engine",
    items: [
      {
        title: "AI Providers",
        href: "/admin/providers",
        icon: Database,
      },
      {
        title: "AI Models",
        href: "/admin/models",
        icon: Settings,
      },
      {
        title: "Subscription Plans",
        href: "/admin/plans",
        icon: Briefcase,
      }
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Client API Usage",
        href: "/admin/client-usage",
        icon: Activity,
      }
    ],
  },
];
