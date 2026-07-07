"use client";

import { Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchBar } from "@/components/ui/search-bar";
import { LayoutHeader } from "@/components/ui/layout-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebarStore } from "@/stores/use-sidebar-store";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export function AdminTopbar() {
  const router = useRouter();
  const { toggle } = useSidebarStore();
  const user = {
    name: "Admin User",
    email: "admin@example.com",
    avatarUrl: undefined,
  };

  return (
    <LayoutHeader
      onMobileMenuToggle={toggle}
      leftContent={
        <div className="flex-1 max-w-md hidden md:block">
          <SearchBar placeholder="Search users, plans, transactions..." />
        </div>
      }
      rightContent={
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-background" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button variant="ghost" className="relative h-9 w-9 rounded-full ml-2 ring-1 ring-border/50 overflow-hidden">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatarUrl} alt={user.name || "Admin"} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {user.name.charAt(0) || "AD"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            } />
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none flex items-center gap-2">
                    {user.name}
                    <Badge className="bg-rose-500 hover:bg-rose-600 text-[10px] h-4 px-1">Admin</Badge>
                  </p>
                  <p className="text-xs leading-none text-muted-foreground mt-1">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer" onClick={() => router.push("/login")}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      }
    />
  );
}
