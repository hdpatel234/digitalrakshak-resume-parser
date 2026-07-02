"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface LayoutHeaderProps extends React.HTMLAttributes<HTMLElement> {
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  onMobileMenuToggle?: () => void;
  showMobileMenuToggle?: boolean;
}

export function LayoutHeader({
  leftContent,
  rightContent,
  onMobileMenuToggle,
  showMobileMenuToggle = true,
  className,
  ...props
}: LayoutHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border/60 bg-background/80 backdrop-blur-xl px-4 md:px-6 shadow-sm shadow-black/5",
        className
      )}
      {...props}
    >
      {showMobileMenuToggle && onMobileMenuToggle && (
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-9 w-9 cursor-pointer text-muted-foreground hover:text-foreground"
          onClick={onMobileMenuToggle}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle mobile menu</span>
        </Button>
      )}

      <div className="flex flex-1 items-center gap-4 min-w-0">
        {leftContent}
      </div>

      {rightContent && (
        <div className="flex items-center gap-2 shrink-0">
          {rightContent}
        </div>
      )}
    </header>
  );
}
