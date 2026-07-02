import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  shortcut?: string;
}

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, shortcut, ...props }, ref) => {
    return (
      <div className={cn("relative flex items-center w-full max-w-sm", className)}>
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <Input
          ref={ref}
          type="search"
          className="pl-9 pr-12 w-full"
          {...props}
        />
        {shortcut && (
          <kbd className="pointer-events-none absolute right-3 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex text-muted-foreground">
            {shortcut}
          </kbd>
        )}
      </div>
    );
  }
);
SearchBar.displayName = "SearchBar";
