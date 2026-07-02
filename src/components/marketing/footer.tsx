import Link from "next/link";
import Image from "next/image";
import { APP_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="grid gap-12 md:grid-cols-4 lg:grid-cols-5 mb-16">
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 blur-md opacity-50" />
                <Image
                  src="/new-logo.png"
                  alt={`${APP_NAME} Logo`}
                  width={32}
                  height={32}
                  className="relative rounded-xl object-cover"
                />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent">{APP_NAME}</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              The next-generation AI parser for HR platforms, applicant tracking systems, and modern recruiting teams.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-foreground">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/parsing-engine" className="text-muted-foreground hover:text-foreground transition-colors">Parsing Engine</Link></li>
              <li><Link href="/api-reference" className="text-muted-foreground hover:text-foreground transition-colors">API Reference</Link></li>
              <li><Link href="/#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link href="/changelog" className="text-muted-foreground hover:text-foreground transition-colors">Changelog</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-foreground">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/#about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="text-muted-foreground hover:text-foreground transition-colors">Careers</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact Sales</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-foreground">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</Link></li>
              <li><Link href="/security" className="text-muted-foreground hover:text-foreground transition-colors">Security (SOC2)</Link></li>
            </ul>
          </div>

        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-border/40 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-foreground transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-foreground transition-colors">GitHub</Link>
            <Link href="#" className="hover:text-foreground transition-colors">LinkedIn</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
