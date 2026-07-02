"use client";

import { useState, useEffect, useCallback } from "react";
import { UploadCloud, FileArchive, Files, RefreshCw, X, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";

import { mockBatchJobs, type BatchJob, type BatchStatus } from "@/data/mock-batches";

// ─── Status helpers ────────────────────────────────────────────────────────────

const statusConfig: Record<BatchStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  completed: { label: "Completed", variant: "default" },
  processing: { label: "Processing", variant: "secondary" },
  queued:    { label: "Queued",     variant: "outline" },
  failed:    { label: "Failed",     variant: "destructive" },
};

function BatchStatusBadge({ status }: { status: BatchStatus }) {
  const cfg = statusConfig[status];
  return (
    <Badge
      variant={cfg.variant}
      className={cn(
        status === "completed" && "bg-emerald-500 hover:bg-emerald-600",
        status === "processing" && "animate-pulse",
      )}
    >
      {cfg.label}
    </Badge>
  );
}

// ─── Batch Row Card ────────────────────────────────────────────────────────────

function BatchCard({ batch }: { batch: BatchJob }) {
  const progressPct = batch.totalFiles > 0 ? Math.round((batch.processed / batch.totalFiles) * 100) : 0;

  return (
    <div className="flex flex-col p-4 rounded-xl border bg-card/50 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className={cn(
            "p-2 rounded-lg shrink-0 mt-0.5",
            batch.source === "zip" ? "bg-indigo-500/10 text-indigo-500" : "bg-violet-500/10 text-violet-500"
          )}>
            {batch.source === "zip" ? <FileArchive className="w-5 h-5" /> : <Files className="w-5 h-5" />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <p className="font-semibold text-sm truncate">{batch.filename}</p>
              <BatchStatusBadge status={batch.status} />
            </div>
            <p className="text-xs font-mono text-muted-foreground">{batch.id}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 cursor-pointer" />}>
            <MoreVertical className="w-4 h-4" />
            <span className="sr-only">Actions</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="cursor-pointer">View Results</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Download Report</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">Delete Batch</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground font-medium">
          <span>{batch.processed} of {batch.totalFiles} processed</span>
          <span className="text-destructive">{batch.failed > 0 ? `${batch.failed} failed` : "No failures"}</span>
        </div>
        <Progress
          value={progressPct}
          className={cn(
            "h-2",
            batch.status === "failed" && "bg-destructive/20",
            batch.status === "processing" && "animate-pulse"
          )}
        />
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            {new Date(batch.createdAt).toLocaleString()}
          </span>
          <span className="text-xs font-semibold">{progressPct}%</span>
        </div>
      </div>
    </div>
  );
}

// ─── Uploader Zone ────────────────────────────────────────────────────────────

interface UploaderZoneProps {
  mode: "zip" | "multi";
  onSubmit: (label: string, count: number) => void;
}

function UploaderZone({ mode, onSubmit }: UploaderZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [staged, setStaged] = useState<File[]>([]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
  };

  const processFiles = (files: FileList) => {
    const arr = Array.from(files);
    if (mode === "zip") {
      const zipFiles = arr.filter(f => f.name.endsWith(".zip"));
      if (zipFiles.length === 0) { toast.error("Please upload a .zip file."); return; }
      setStaged(zipFiles.slice(0, 1));
    } else {
      const validFiles = arr.filter(f => /\.(pdf|doc|docx)$/i.test(f.name));
      if (validFiles.length === 0) { toast.error("Please upload PDF or DOC files."); return; }
      setStaged(prev => [...prev, ...validFiles]);
    }
  };

  const handleSubmit = () => {
    if (staged.length === 0) return;
    const label = mode === "zip" ? staged[0].name : `${staged.length} files selected`;
    onSubmit(label, mode === "zip" ? Math.floor(Math.random() * 40) + 10 : staged.length);
    setStaged([]);
    toast.success("Batch submitted for processing!");
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "relative flex flex-col items-center justify-center w-full min-h-[200px] p-8 rounded-xl border-2 border-dashed transition-all cursor-pointer",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border/60 hover:border-primary/50 hover:bg-muted/30 bg-card"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById(`file-input-${mode}`)?.click()}
      >
        <input
          id={`file-input-${mode}`}
          type="file"
          className="hidden"
          accept={mode === "zip" ? ".zip" : ".pdf,.doc,.docx"}
          multiple={mode === "multi"}
          onChange={e => e.target.files && processFiles(e.target.files)}
        />
        <div className="flex flex-col items-center text-center gap-3 pointer-events-none">
          <div className="p-4 bg-primary/10 rounded-full group-hover:scale-105 transition-transform">
            {mode === "zip" ? <FileArchive className="w-9 h-9 text-primary" /> : <UploadCloud className="w-9 h-9 text-primary" />}
          </div>
          <div>
            <p className="font-semibold text-base">
              {mode === "zip" ? "Drop your ZIP archive here" : "Drop multiple resumes here"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === "zip" ? "Accepts .zip files only" : "Accepts PDF, DOC, DOCX files"}
            </p>
          </div>
        </div>
      </div>

      {staged.length > 0 && (
        <div className="space-y-2">
          {staged.map((file, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-muted/20 text-sm">
              <div className="flex items-center gap-2 min-w-0">
                <Files className="w-4 h-4 shrink-0 text-muted-foreground" />
                <span className="truncate font-medium">{file.name}</span>
                <span className="text-muted-foreground shrink-0">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                onClick={e => { e.stopPropagation(); setStaged(prev => prev.filter((_, j) => j !== i)); }}>
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
          <Button className="w-full h-11 mt-2" onClick={handleSubmit}>
            <UploadCloud className="w-4 h-4 mr-2" />
            Submit Batch ({staged.length} {mode === "zip" ? "archive" : "files"})
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function BulkUploadManager() {
  const [batches, setBatches] = useState<BatchJob[]>(mockBatchJobs);

  // Simulate processing progress for in-flight batches
  useEffect(() => {
    const timer = setInterval(() => {
      setBatches(prev => prev.map(batch => {
        if (batch.status !== "processing") return batch;
        const increment = Math.floor(Math.random() * 3) + 1;
        const newProcessed = Math.min(batch.processed + increment, batch.totalFiles);
        const isDone = newProcessed >= batch.totalFiles;
        return { ...batch, processed: newProcessed, status: isDone ? "completed" : "processing" };
      }));
    }, 800);
    return () => clearInterval(timer);
  }, []);

  const handleNewBatch = useCallback((label: string, count: number) => {
    const newBatch: BatchJob = {
      id: `BATCH-2024-00${batches.length + 1}`,
      totalFiles: count,
      processed: 0,
      failed: 0,
      status: "processing",
      createdAt: new Date().toISOString(),
      source: label.endsWith(".zip") ? "zip" : "multi-file",
      filename: label,
    };
    setBatches(prev => [newBatch, ...prev]);
  }, [batches.length]);

  // Table columns
  const columns = [
    {
      header: "Batch ID",
      accessorKey: "id" as keyof BatchJob,
      cell: (b: BatchJob) => <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">{b.id}</code>,
    },
    {
      header: "File / Archive",
      accessorKey: "filename" as keyof BatchJob,
      className: "hidden md:table-cell text-muted-foreground text-sm truncate max-w-[180px]",
    },
    {
      header: "Total",
      accessorKey: "totalFiles" as keyof BatchJob,
      className: "text-center",
      cell: (b: BatchJob) => <span className="font-medium">{b.totalFiles}</span>,
    },
    {
      header: "Processed",
      accessorKey: "processed" as keyof BatchJob,
      className: "text-center hidden sm:table-cell",
      cell: (b: BatchJob) => <span className="text-emerald-600 dark:text-emerald-400 font-medium">{b.processed}</span>,
    },
    {
      header: "Failed",
      accessorKey: "failed" as keyof BatchJob,
      className: "text-center hidden sm:table-cell",
      cell: (b: BatchJob) => (
        <span className={cn("font-medium", b.failed > 0 ? "text-destructive" : "text-muted-foreground")}>{b.failed}</span>
      ),
    },
    {
      header: "Progress",
      accessorKey: "processed" as keyof BatchJob,
      className: "min-w-[120px] hidden lg:table-cell",
      cell: (b: BatchJob) => {
        const pct = b.totalFiles > 0 ? Math.round((b.processed / b.totalFiles) * 100) : 0;
        return (
          <div className="flex items-center gap-2">
            <Progress value={pct} className="h-1.5 flex-1" />
            <span className="text-xs text-muted-foreground w-8 text-right">{pct}%</span>
          </div>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "status" as keyof BatchJob,
      cell: (b: BatchJob) => <BatchStatusBadge status={b.status} />,
    },
  ];

  const stats = {
    total: batches.length,
    processing: batches.filter(b => b.status === "processing").length,
    completed: batches.filter(b => b.status === "completed").length,
    failed: batches.filter(b => b.status === "failed").length,
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Bulk Upload</h1>
          <p className="text-muted-foreground mt-1">
            Upload ZIP archives or multiple files for batch AI processing.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setBatches([...mockBatchJobs])}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Batches", value: stats.total },
          { label: "Processing", value: stats.processing, accent: "text-indigo-500" },
          { label: "Completed", value: stats.completed, accent: "text-emerald-500" },
          { label: "Failed", value: stats.failed, accent: "text-destructive" },
        ].map(item => (
          <Card key={item.label} className="shadow-sm">
            <CardContent className="pt-5">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className={cn("text-3xl font-bold mt-1", item.accent)}>{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload Tabs */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Create New Batch</CardTitle>
          <CardDescription>Choose your preferred upload method below.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="zip" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 max-w-sm">
              <TabsTrigger value="zip" className="gap-2">
                <FileArchive className="w-4 h-4" />
                ZIP Archive
              </TabsTrigger>
              <TabsTrigger value="multi" className="gap-2">
                <Files className="w-4 h-4" />
                Multi-File
              </TabsTrigger>
            </TabsList>
            <TabsContent value="zip" className="outline-none">
              <UploaderZone mode="zip" onSubmit={handleNewBatch} />
            </TabsContent>
            <TabsContent value="multi" className="outline-none">
              <UploaderZone mode="multi" onSubmit={handleNewBatch} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Batch Cards (Mobile) */}
      <div className="space-y-4 lg:hidden">
        <h2 className="text-lg font-semibold">Batch History</h2>
        {batches.map(batch => (
          <BatchCard key={batch.id} batch={batch} />
        ))}
      </div>

      {/* Batch Table (Desktop) */}
      <div className="hidden lg:block space-y-4">
        <h2 className="text-lg font-semibold">Batch History</h2>
        <DataTable
          columns={columns}
          data={batches}
          emptyTitle="No batches yet"
          emptyDescription="Submit your first batch to get started."
        />
      </div>
    </div>
  );
}
