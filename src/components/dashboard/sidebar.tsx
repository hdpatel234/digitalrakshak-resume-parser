"use client";

import { useSidebarStore } from "@/stores/use-sidebar-store";
import { dashboardNav } from "@/data/navigation";
import { LayoutSidebar } from "@/components/ui/layout-sidebar";
import { Logo } from "@/components/shared/logo";

export function Sidebar() {
  const { isCollapsed, toggleCollapse } = useSidebarStore();

  return (
    <LayoutSidebar
      navGroups={dashboardNav}
      isCollapsed={isCollapsed}
      onToggleCollapse={toggleCollapse}
      logo={<Logo showText={!isCollapsed} size="sm" />}
    />
  );
}
