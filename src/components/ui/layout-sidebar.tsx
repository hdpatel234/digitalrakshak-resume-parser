"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  title: string;
  href: string;
  icon?: React.ElementType;
  disabled?: boolean;
  badge?: string;
}

interface NavGroup {
  title?: string;
  items: NavItem[];
}

interface LayoutSidebarProps {
  logo?: React.ReactNode;
  navGroups: NavGroup[];
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  footer?: React.ReactNode;
  className?: string;
}

export function LayoutSidebar({
  logo,
  navGroups,
  isCollapsed = false,
  onToggleCollapse,
  footer,
  className,
}: LayoutSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col border-r border-border/60 bg-card/30 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-border/60">
        <div className="flex items-center gap-2 overflow-hidden">
          {logo}
        </div>
        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className={cn(
              "h-7 w-7 cursor-pointer transition-transform text-muted-foreground hover:text-foreground",
              isCollapsed && "rotate-180"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-hide">
        {navGroups.map((group, index) => (
          <div key={index}>
            {group.title && !isCollapsed && (
              <p className="mb-2 px-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
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
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all group",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                      item.disabled && "opacity-50 pointer-events-none",
                      isCollapsed && "justify-center px-2"
                    )}
                    title={isCollapsed ? item.title : undefined}
                  >
                    {Icon && (
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0 transition-colors",
                          isActive ? "text-primary" : "group-hover:text-foreground"
                        )}
                      />
                    )}
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 truncate">{item.title}</span>
                        {item.badge && (
                          <Badge
                            variant={item.disabled ? "outline" : "secondary"}
                            className="text-[10px] h-5 px-1.5"
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
          </div>
        ))}
      </nav>

      {footer && (
        <div className={cn("p-3 border-t border-border/60", isCollapsed && "flex justify-center")}>
          {footer}
        </div>
      )}
    </aside>
  );
}
