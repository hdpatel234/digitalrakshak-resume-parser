"use client";

import * as React from "react";
import { UploadCloud, File as FileIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";


interface FileUploadProps extends React.HTMLAttributes<HTMLDivElement> {
  onFilesSelected?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
}

export function FileUpload({
  onFilesSelected,
  accept = "application/pdf,.doc,.docx",
  multiple = true,
  maxSizeMB = 10,
  className,
  ...props
}: FileUploadProps) {
  const [dragActive, setDragActive] = React.useState(false);
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFiles = (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter(
      (file) => file.size <= maxSizeMB * 1024 * 1024
    );
    
    if (!multiple) {
      const singleFile = validFiles.slice(0, 1);
      setSelectedFiles(singleFile);
      onFilesSelected?.(singleFile);
    } else {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
      onFilesSelected?.(validFiles);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFiles(e.target.files);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  return (
    <div className={cn("w-full space-y-4", className)} {...props}>
      <div
        className={cn(
          "relative flex flex-col items-center justify-center w-full min-h-[200px] p-6 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden group",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/30"
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
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
        />
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="p-4 bg-primary/10 rounded-full group-hover:scale-105 transition-transform">
            <UploadCloud className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">
              {accept.replace(/,/g, ", ")} (Max. {maxSizeMB}MB)
            </p>
          </div>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          {selectedFiles.map((file, i) => (
            <div
              key={`${file.name}-${i}`}
              className="flex items-center justify-between p-3 rounded-lg border bg-card/50 shadow-sm"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <FileIcon className="w-5 h-5 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(i);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
