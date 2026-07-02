export type BatchStatus = "processing" | "completed" | "failed" | "queued";

export interface BatchJob {
  id: string;
  totalFiles: number;
  processed: number;
  failed: number;
  status: BatchStatus;
  createdAt: string;
  source: "zip" | "multi-file";
  filename: string;
}

export const mockBatchJobs: BatchJob[] = [
  {
    id: "BATCH-2024-001",
    totalFiles: 48,
    processed: 48,
    failed: 2,
    status: "completed",
    createdAt: "2024-10-25T14:32:00Z",
    source: "zip",
    filename: "hr_candidates_oct.zip",
  },
  {
    id: "BATCH-2024-002",
    totalFiles: 22,
    processed: 17,
    failed: 1,
    status: "processing",
    createdAt: "2024-10-25T16:10:00Z",
    source: "multi-file",
    filename: "22 files selected",
  },
  {
    id: "BATCH-2024-003",
    totalFiles: 100,
    processed: 0,
    failed: 0,
    status: "queued",
    createdAt: "2024-10-25T17:05:00Z",
    source: "zip",
    filename: "engineering_resumes.zip",
  },
  {
    id: "BATCH-2024-004",
    totalFiles: 15,
    processed: 10,
    failed: 5,
    status: "failed",
    createdAt: "2024-10-24T09:00:00Z",
    source: "multi-file",
    filename: "15 files selected",
  },
  {
    id: "BATCH-2024-005",
    totalFiles: 60,
    processed: 60,
    failed: 0,
    status: "completed",
    createdAt: "2024-10-23T11:45:00Z",
    source: "zip",
    filename: "sales_team_resumes.zip",
  },
];
