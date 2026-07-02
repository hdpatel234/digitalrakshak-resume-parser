"use client";

import * as React from "react";
import { UploadCloud, FileText, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export type UploadState = "pending" | "uploading" | "processing" | "completed" | "failed";

export interface UploadJob {
  id: string;
  file: File;
  progress: number;
  state: UploadState;
  errorMessage?: string;
}

interface ResumeUploaderProps {
  mode: "single" | "bulk";
  maxSizeMB?: number;
}

export function ResumeUploader({ mode, maxSizeMB = 10 }: ResumeUploaderProps) {
  const [dragActive, setDragActive] = React.useState(false);
  const [jobs, setJobs] = React.useState<UploadJob[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Mock Upload and Processing Pipeline
  const processJob = (jobId: string) => {
    // 1. Upload Phase (0-100% over ~1.5s)
    let currentProgress = 0;
    const uploadInterval = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(uploadInterval);
        
        // Transition to Processing Phase
        setJobs((current) =>
          current.map((j) => (j.id === jobId ? { ...j, progress: 100, state: "processing" } : j))
        );

        // 2. Processing Phase (Random delay 1.5s - 3s)
        setTimeout(() => {
          const isSuccess = Math.random() > 0.15; // 85% success rate
          setJobs((current) =>
            current.map((j) =>
              j.id === jobId
                ? {
                    ...j,
                    state: isSuccess ? "completed" : "failed",
                    errorMessage: isSuccess ? undefined : "Failed to extract text layer from PDF.",
                  }
                : j
            )
          );
        }, 1500 + Math.random() * 1500);

      } else {
        setJobs((current) =>
          current.map((j) => (j.id === jobId ? { ...j, progress: currentProgress } : j))
        );
      }
    }, 200);
  };

  const handleFiles = (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter((file) => file.size <= maxSizeMB * 1024 * 1024);
    
    let filesToProcess = validFiles;
    if (mode === "single") {
      filesToProcess = validFiles.slice(0, 1);
      // If single mode, we reset previous jobs to simulate a fresh upload each time if they want
      // Actually, we'll just append, but ensure we only take 1 file from the drop
    }

    const newJobs: UploadJob[] = filesToProcess.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      progress: 0,
      state: "uploading",
    }));

    if (mode === "single") {
      setJobs(newJobs);
    } else {
      setJobs((prev) => [...prev, ...newJobs]);
    }

    // Start processing each new job
    newJobs.forEach((job) => processJob(job.id));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
    // Reset input so the same file can be selected again if needed
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeJob = (id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  return (
    <div className="w-full space-y-6">
      {/* Dropzone */}
      <div
        className={cn(
          "relative flex flex-col items-center justify-center w-full min-h-[240px] p-8 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden group",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border/60 hover:border-primary/50 hover:bg-muted/30 bg-card shadow-sm"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="application/pdf,.doc,.docx"
          multiple={mode === "bulk"}
          onChange={handleChange}
        />
        <div className="flex flex-col items-center justify-center space-y-4 text-center pointer-events-none">
          <div className="p-4 bg-primary/10 rounded-full group-hover:scale-105 transition-transform duration-300">
            <UploadCloud className="w-10 h-10 text-primary" />
          </div>
          <div className="space-y-1.5">
            <h4 className="text-lg font-semibold tracking-tight">
              {mode === "single" ? "Upload a resume" : "Bulk upload resumes"}
            </h4>
            <p className="text-sm text-muted-foreground max-w-sm">
              Drag and drop {mode === "single" ? "your file" : "your files"} here, or click to browse your computer.
            </p>
            <p className="text-xs text-muted-foreground/70 pt-2 font-medium">
              Supported formats: PDF, DOC, DOCX (Max {maxSizeMB}MB)
            </p>
          </div>
        </div>
      </div>

      {/* Upload Cards */}
      {jobs.length > 0 && (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="flex flex-col p-4 rounded-xl border bg-card/50 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 overflow-hidden flex-1">
                  <div className={cn(
                    "p-2.5 rounded-lg shrink-0",
                    job.state === "failed" ? "bg-destructive/10 text-destructive" : 
                    job.state === "completed" ? "bg-emerald-500/10 text-emerald-500" : 
                    "bg-primary/10 text-primary"
                  )}>
                    <FileText className="w-6 h-6" />
                  </div>
                  
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold truncate leading-none">{job.file.name}</p>
                      {job.state === "completed" && (
                        <Badge variant="default" className="h-5 px-1.5 text-[10px] bg-emerald-500 hover:bg-emerald-600">Success</Badge>
                      )}
                      {job.state === "failed" && (
                        <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">Failed</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                      <span>{(job.file.size / 1024 / 1024).toFixed(2)} MB</span>
                      <span>•</span>
                      {job.state === "uploading" && <span className="text-primary">Uploading... {Math.round(job.progress)}%</span>}
                      {job.state === "processing" && <span className="text-indigo-500 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Extracting AI data</span>}
                      {job.state === "completed" && <span>Processing complete</span>}
                      {job.state === "failed" && <span className="text-destructive truncate">{job.errorMessage}</span>}
                    </div>

                    {(job.state === "uploading" || job.state === "processing") && (
                      <Progress 
                        value={job.state === "processing" ? null : job.progress ?? null} 
                        className={cn("h-1.5 mt-2", job.state === "processing" && "animate-pulse")} 
                      />
                    )}
                  </div>
                </div>

                <div className="flex items-center shrink-0">
                  {job.state === "completed" ? (
                    <Button variant="secondary" size="sm" className="h-8 text-xs">
                      View Results
                    </Button>
                  ) : job.state === "failed" ? (
                    <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => processJob(job.id)}>
                      Retry
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeJob(job.id)}
                    >
                      <X className="w-4 h-4" />
                      <span className="sr-only">Cancel upload</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
