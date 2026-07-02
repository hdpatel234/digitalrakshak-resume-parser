"use client";

import { Bell } from "lucide-react";
import { useSidebarStore } from "@/stores/use-sidebar-store";
import { LayoutHeader } from "@/components/ui/layout-header";
import { useSession, signOut } from "next-auth/react";
import { SearchBar } from "@/components/ui/search-bar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { UserAvatar } from "@/components/shared/user-avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Topbar() {
  const toggleCollapse = useSidebarStore((state) => state.toggleCollapse);
  const { data: session } = useSession();
  const user = session?.user;

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  // Mock User Fallback
  const displayUser = user || {
    name: "Demo User",
    email: "demo@example.com",
    avatar: "/avatars/01.png",
  };

  return (
    <LayoutHeader
      onMobileMenuToggle={toggleCollapse}
      leftContent={
        <div className="hidden md:block w-full max-w-sm">
          <SearchBar placeholder="Search resumes, files, or settings..." shortcut="⌘K" />
        </div>
      }
      rightContent={
        <>
          <ThemeToggle />
          
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full cursor-pointer">
                  <Bell className="h-4 w-4" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive border-2 border-background" />
                  <span className="sr-only">Notifications</span>
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-4 text-center text-sm text-muted-foreground">
                No new notifications
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" className="relative h-9 w-9 rounded-full cursor-pointer" id="user-menu-trigger">
                  <UserAvatar name={displayUser.name || "User"} avatar={(displayUser as any).avatar || (displayUser as any).image || undefined} size="sm" />
                </Button>
              }
            />
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{displayUser.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {displayUser.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" render={<Link href="/dashboard/settings" />}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" render={<Link href="/dashboard/billing" />}>
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" render={<Link href="/admin" />}>
                Admin Panel
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive cursor-pointer"
                onClick={handleLogout}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      }
    />
  );
}
