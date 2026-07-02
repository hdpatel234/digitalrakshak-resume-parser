"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

interface DataTableProps<TData> {
  columns: {
    header: React.ReactNode;
    accessorKey: keyof TData | string;
    cell?: (item: TData) => React.ReactNode;
    className?: string;
  }[];
  data: TData[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (item: TData) => void;
  className?: string;
}

export function DataTable<TData>({
  columns,
  data,
  isLoading = false,
  emptyTitle = "No data available",
  emptyDescription = "There is nothing to display here at the moment.",
  onRowClick,
  className,
}: DataTableProps<TData>) {
  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              {columns.map((col, i) => (
                <TableHead key={i} className={col.className}>
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((col, colIndex) => (
                  <TableCell key={colIndex} className={col.className}>
                    <Skeleton className="h-4 w-full max-w-[120px]" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        className="min-h-[200px]"
      />
    );
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden shadow-sm shadow-black/5">
      <Table className={className}>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30 border-b-border/60">
            {columns.map((col, i) => (
              <TableHead key={i} className={col.className}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, rowIndex) => (
            <TableRow
              key={rowIndex}
              onClick={() => onRowClick?.(item)}
              className={
                onRowClick
                  ? "cursor-pointer hover:bg-muted/30 transition-colors"
                  : "hover:bg-transparent"
              }
            >
              {columns.map((col, colIndex) => (
                <TableCell key={colIndex} className={col.className}>
                  {col.cell ? col.cell(item) : String(item[col.accessorKey as keyof TData] || "")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
