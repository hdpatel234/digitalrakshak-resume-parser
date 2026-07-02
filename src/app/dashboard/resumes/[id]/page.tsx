"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Copy, FileJson, Table2, FileText, Check } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

import { TableView } from "@/components/dashboard/resume-views/table-view";
import { JsonView } from "@/components/dashboard/resume-views/json-view";
import { RawTextView } from "@/components/dashboard/resume-views/raw-text-view";
import { mockParsedResume } from "@/data/mock-resume";

export default function ParsedResumePage({ params }: { params: { id: string } }) {
  const [copied, setCopied] = useState(false);

  const handleCopyJSON = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(mockParsedResume, null, 2));
      setCopied(true);
      toast.success("JSON copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy JSON");
    }
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(mockParsedResume, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `parsed_resume_${params.id}.json`);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast.success("Download started");
  };

  const handleDownloadCSV = () => {
    // Basic CSV mock generation from skills/experience arrays
    const headers = "First Name,Last Name,Email,Phone\n";
    const row = `${mockParsedResume.personal_information.first_name},${mockParsedResume.personal_information.last_name},${mockParsedResume.personal_information.email},${mockParsedResume.personal_information.phone}\n`;
    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(headers + row);
    
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `parsed_resume_${params.id}.csv`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast.success("CSV Download started");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto pb-8">
      {/* Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground" render={<Link href="/dashboard" />}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {mockParsedResume.personal_information.first_name} {mockParsedResume.personal_information.last_name}
            </h1>
            <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">Parsed</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Uploaded on {new Date().toLocaleDateString()} • ID: {params.id}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyJSON}>
            {copied ? <Check className="w-4 h-4 mr-2 text-emerald-500" /> : <Copy className="w-4 h-4 mr-2" />}
            Copy JSON
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadCSV}>
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
          <Button size="sm" onClick={handleDownloadJSON}>
            <Download className="w-4 h-4 mr-2" />
            JSON
          </Button>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="structured" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-[400px]">
          <TabsTrigger value="structured" className="flex gap-2">
            <Table2 className="w-4 h-4" />
            <span className="hidden sm:inline">Structured Data</span>
            <span className="sm:hidden">Data</span>
          </TabsTrigger>
          <TabsTrigger value="json" className="flex gap-2">
            <FileJson className="w-4 h-4" />
            <span>JSON</span>
          </TabsTrigger>
          <TabsTrigger value="raw" className="flex gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Raw Text</span>
            <span className="sm:hidden">Raw</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="structured" className="outline-none">
          <TableView />
        </TabsContent>

        <TabsContent value="json" className="outline-none">
          <JsonView />
        </TabsContent>

        <TabsContent value="raw" className="outline-none">
          <RawTextView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
