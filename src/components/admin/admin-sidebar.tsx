"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useSidebarStore } from "@/stores/use-sidebar-store";
import { adminNav } from "@/data/navigation";

export function AdminSidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleCollapse } = useSidebarStore();

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col border-r bg-card/50 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo with Admin badge */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        <div className="flex items-center gap-2">
          <Logo showText={!isCollapsed} size="sm" />
          {!isCollapsed && (
            <Badge variant="outline" className="text-[10px] h-5 border-amber-500/50 text-amber-600 dark:text-amber-400">
              Admin
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapse}
          className={cn(
            "h-7 w-7 cursor-pointer transition-transform",
            isCollapsed && "rotate-180"
          )}
          id="admin-sidebar-toggle"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {adminNav.map((group) => (
          <div key={group.title}>
            {!isCollapsed && (
              <p className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {group.title}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.title}
                    href={item.disabled ? "#" : item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                      isActive
                        ? "bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent",
                      item.disabled && "opacity-50 pointer-events-none",
                      isCollapsed && "justify-center px-2"
                    )}
                    title={isCollapsed ? item.title : undefined}
                  >
                    {Icon && (
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          isActive && "text-amber-500"
                        )}
                      />
                    )}
                    {!isCollapsed && (
                      <>
                        <span className="flex-1">{item.title}</span>
                        {item.badge && (
                          <Badge
                            variant={item.disabled ? "outline" : "secondary"}
                            className="text-xs h-5 px-1.5"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
            {!isCollapsed && <Separator className="mt-4" />}
          </div>
        ))}
      </nav>

      {/* Back to Dashboard */}
      {!isCollapsed && (
        <div className="p-3 border-t">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      )}
    </aside>
  );
}
