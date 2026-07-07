"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Logo } from "@/components/shared/logo";
import { useSidebarStore } from "@/stores/use-sidebar-store";
import { adminNav } from "@/data/navigation";
import { cn } from "@/lib/utils";

export function AdminTopbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toggle } = useSidebarStore();
  
  const user = { name: "Admin", email: "admin@example.com", avatar: "", role: "admin" };

  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((seg, i) => ({
    label: seg.charAt(0).toUpperCase() + seg.slice(1),
    href: "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }));

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-xl px-4 md:px-6">
      {/* Mobile menu */}
      <Sheet>
        <SheetTrigger
          className="lg:hidden"
          render={
            <Button variant="ghost" size="icon" className="h-9 w-9 cursor-pointer">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          }
        />
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
          <div className="flex h-16 items-center gap-2 px-4 border-b">
            <Logo size="sm" />
            <Badge variant="outline" className="text-[10px] h-5 border-amber-500/50 text-amber-600 dark:text-amber-400">
              Admin
            </Badge>
          </div>
          <nav className="py-4 px-3 space-y-6">
            {adminNav.map((group) => (
              <div key={group.title}>
                <p className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {group.title}
                </p>
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
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent",
                          item.disabled && "opacity-50 pointer-events-none"
                        )}
                      >
                        {Icon && <Icon className="h-4 w-4 shrink-0" />}
                        <span className="flex-1">{item.title}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs h-5 px-1.5">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    );
                  })}
                </div>
                <Separator className="mt-4" />
              </div>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <Button
        variant="ghost"
        size="icon"
        onClick={toggle}
        className="hidden lg:flex h-9 w-9 cursor-pointer"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Breadcrumbs */}
      <nav className="hidden md:flex items-center gap-1.5 text-sm">
        {breadcrumbs.map((crumb) => (
          <div key={crumb.href} className="flex items-center gap-1.5">
            {crumb.isLast ? (
              <span className="font-medium text-foreground">{crumb.label}</span>
            ) : (
              <>
                <Link
                  href={crumb.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {crumb.label}
                </Link>
                <span className="text-muted-foreground">/</span>
              </>
            )}
          </div>
        ))}
      </nav>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative h-9 w-9 cursor-pointer">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-amber-500 text-[10px] font-bold text-white flex items-center justify-center">
            5
          </span>
        </Button>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="relative h-9 w-9 rounded-full cursor-pointer" id="admin-user-menu">
                <UserAvatar name={user.name || "Admin"} avatar={(user as any).avatar || (user as any).image || undefined} size="sm" />
              </Button>
            }
          />
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                <Badge variant="outline" className="w-fit text-[10px] mt-1 border-amber-500/50 text-amber-600">
                  {(user as any)?.role ? ((user as any).role as string).replace("_", " ") : "admin"}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" render={<Link href="/dashboard" />}>
              User Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" render={<Link href="/admin" />}>
              Admin Panel
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={() => {
                router.push("/login");
              }}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
