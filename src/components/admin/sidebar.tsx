"use client";

import { useSidebarStore } from "@/stores/use-sidebar-store";
import { adminNav } from "@/data/navigation";
import { LayoutSidebar } from "@/components/ui/layout-sidebar";
import { Logo } from "@/components/shared/logo";
import { Badge } from "@/components/ui/badge";

export function AdminSidebar() {
  const { isCollapsed, toggleCollapse } = useSidebarStore();

  return (
    <LayoutSidebar
      navGroups={adminNav}
      isCollapsed={isCollapsed}
      onToggleCollapse={toggleCollapse}
      logo={
        <div className="flex items-center gap-2">
          <Logo showText={!isCollapsed} size="sm" />
          {!isCollapsed && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Admin</Badge>}
        </div>
      }
    />
  );
}
