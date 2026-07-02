"use client";

import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { recentResumes } from "@/data/stats";

export function RecentResumesTable() {
  const columns = [
    {
      header: "Candidate Name",
      accessorKey: "name",
      className: "font-medium",
    },
    {
      header: "Email",
      accessorKey: "email",
      className: "hidden sm:table-cell text-muted-foreground",
    },
    {
      header: "Skills",
      accessorKey: "skills",
      className: "hidden md:table-cell truncate max-w-[200px] text-muted-foreground",
    },
    {
      header: "Experience",
      accessorKey: "experience",
      className: "hidden lg:table-cell text-muted-foreground",
    },
    {
      header: "Upload Date",
      accessorKey: "uploadDate",
      className: "text-muted-foreground",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item: typeof recentResumes[0]) => {
        const status = item.status;
        let variant: "default" | "secondary" | "destructive" | "outline" = "default";
        
        if (status === "Success") variant = "default";
        if (status === "Processing") variant = "secondary";
        if (status === "Failed") variant = "destructive";

        return (
          <Badge variant={variant} className="whitespace-nowrap">
            {status}
          </Badge>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold tracking-tight">Recent Parsed Resumes</h3>
      </div>
      <DataTable columns={columns} data={recentResumes} />
    </div>
  );
}
