"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { marketingNav } from "@/data/navigation";

function smoothScrollToSection(sectionId: string) {
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function handleNavClick(
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string,
  pathname: string,
  router: ReturnType<typeof useRouter>,
  onClose?: () => void
) {
  if (href.startsWith("/#")) {
    const sectionId = href.slice(2);
    if (pathname === "/") {
      e.preventDefault();
      smoothScrollToSection(sectionId);
      onClose?.();
    } else {
      // Navigate to home then scroll after load
      e.preventDefault();
      router.push(`/${href.slice(1)}`);
      onClose?.();
    }
  } else {
    onClose?.();
  }
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1" id="desktop-nav">
          {marketingNav.map((item) => (
            <a
              key={item.title}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href, pathname, router)}
              className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground rounded-md hover:bg-accent cursor-pointer"
            >
              {item.title}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" render={<Link href="/login" />} className="cursor-pointer">
              Sign In
            </Button>
            <Button
              render={<Link href="/register" />}
              className="cursor-pointer bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:from-indigo-600 hover:to-violet-700 shadow-md shadow-indigo-500/25"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="md:hidden"
              render={
                <Button variant="ghost" size="icon" className="h-9 w-9 cursor-pointer">
                  {open ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                  <span className="sr-only">Toggle menu</span>
                </Button>
              }
            />
            <SheetContent side="right" className="w-[300px] pt-10">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <nav className="flex flex-col gap-4">
                {marketingNav.map((item) => (
                  <a
                    key={item.title}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href, pathname, router, () => setOpen(false))}
                    className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                  >
                    {item.title}
                  </a>
                ))}
                <div className="mt-4 flex flex-col gap-2">
                  <Button variant="outline" render={<Link href="/login" onClick={() => setOpen(false)} />} className="w-full cursor-pointer">
                      Sign In
                  </Button>
                  <Button
                    render={<Link href="/register" onClick={() => setOpen(false)} />}
                    className="w-full cursor-pointer bg-gradient-to-r from-indigo-500 to-violet-600 text-white"
                  >
                      Get Started
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
