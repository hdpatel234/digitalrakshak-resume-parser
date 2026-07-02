"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Key,
  Plus,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  CheckCircle2,
  Terminal,
  ShieldCheck,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// ─── Types & Mock Data ──────────────────────────────────────────────────────

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string | null;
  status: "active" | "revoked";
}

const INITIAL_KEYS: ApiKey[] = [
  {
    id: "key_1",
    name: "Production",
    key: "drk_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
    createdAt: "2024-09-15",
    lastUsed: "2 hours ago",
    status: "active",
  },
  {
    id: "key_2",
    name: "Staging",
    key: "drk_live_q1r2s3t4u5v6w7x8y9z0a1b2c3d4e5f6",
    createdAt: "2024-10-01",
    lastUsed: "Yesterday",
    status: "active",
  },
  {
    id: "key_3",
    name: "CI/CD Pipeline",
    key: "drk_live_g1h2i3j4k5l6m7n8o9p0q1r2s3t4u5v6",
    createdAt: "2024-08-20",
    lastUsed: null,
    status: "revoked",
  },
];

function maskKey(key: string) {
  return key.slice(0, 12) + "••••••••••••••••••••" + key.slice(-4);
}

function generateRandomKey() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return "drk_live_" + Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

// ─── API Doc Card ──────────────────────────────────────────────────────────

const CODE_EXAMPLES = [
  {
    label: "Parse Single Resume",
    method: "POST",
    endpoint: "/api/v1/parse",
    code: `curl -X POST https://api.digitalrakshak.io/v1/parse \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: multipart/form-data" \\
  -F "file=@resume.pdf"`,
  },
  {
    label: "Bulk Parse",
    method: "POST",
    endpoint: "/api/v1/parse/bulk",
    code: `curl -X POST https://api.digitalrakshak.io/v1/parse/bulk \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: multipart/form-data" \\
  -F "files=@resumes.zip"`,
  },
  {
    label: "Retrieve Result",
    method: "GET",
    endpoint: "/api/v1/results/{id}",
    code: `curl -X GET https://api.digitalrakshak.io/v1/results/res_abc123 \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
  },
];

function ApiDocsCard() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(CODE_EXAMPLES[selectedIdx].code);
    setCopied(true);
    toast.success("Code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-primary" />
          <CardTitle>API Quick Reference</CardTitle>
        </div>
        <CardDescription>
          Use your API key as a Bearer token in the Authorization header for every request.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Endpoint Selector */}
        <div className="flex flex-wrap gap-2">
          {CODE_EXAMPLES.map((ex, i) => (
            <button
              key={i}
              onClick={() => setSelectedIdx(i)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                selectedIdx === i
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/50"
              )}
            >
              <span className={cn(
                "mr-1.5 font-mono",
                ex.method === "GET" ? "text-emerald-500" : "text-blue-400"
              )}>
                {ex.method}
              </span>
              {ex.label}
            </button>
          ))}
        </div>

        {/* Code Block */}
        <div className="relative rounded-xl overflow-hidden border border-white/10">
          <div className="flex items-center justify-between px-4 py-2 bg-[#0d1117] border-b border-white/10">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            </div>
            <span className="text-xs text-white/40 font-mono">{CODE_EXAMPLES[selectedIdx].endpoint}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-white/50 hover:text-white hover:bg-white/10"
              onClick={handleCopy}
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </Button>
          </div>
          <pre className="bg-[#0d1117] p-4 text-[13px] font-mono text-[#c9d1d9] overflow-x-auto leading-relaxed">
            {CODE_EXAMPLES[selectedIdx].code}
          </pre>
        </div>

        {/* Quick Tips */}
        <div className="grid sm:grid-cols-2 gap-3 pt-2">
          {[
            { icon: ShieldCheck, text: "All requests must include a valid Bearer token." },
            { icon: Zap, text: "Rate limit: 1,000 requests/minute on Pro plan." },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-start gap-2 text-xs text-muted-foreground p-3 rounded-lg bg-muted/30 border border-border/40">
              <Icon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>(INITIAL_KEYS);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [createdKey, setCreatedKey] = useState<ApiKey | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleVisibility = (id: string) => {
    setVisibleKeys((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCopy = async (key: ApiKey) => {
    await navigator.clipboard.writeText(key.key);
    setCopiedId(key.id);
    toast.success("API key copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRevoke = (id: string) => {
    setKeys((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: "revoked" } : k))
    );
    toast.success("API key revoked.");
  };

  const handleGenerate = async () => {
    if (!newKeyName.trim()) {
      toast.error("Please enter a name for your API key.");
      return;
    }
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 1000));
    const newKey: ApiKey = {
      id: `key_${Date.now()}`,
      name: newKeyName.trim(),
      key: generateRandomKey(),
      createdAt: new Date().toISOString().split("T")[0],
      lastUsed: null,
      status: "active",
    };
    setKeys((prev) => [newKey, ...prev]);
    setCreatedKey(newKey);
    setNewKeyName("");
    setIsGenerating(false);
  };

  const activeCount = keys.filter((k) => k.status === "active").length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">API Keys</h1>
          <p className="text-muted-foreground mt-1">
            Manage your API keys to authenticate requests to the parsing engine.
          </p>
        </div>
        <Button className="w-fit gap-2" onClick={() => setShowDialog(true)}>
          <Plus className="w-4 h-4" />
          Generate New Key
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Keys", value: keys.length },
          { label: "Active Keys", value: activeCount, accent: "text-emerald-500" },
          { label: "Revoked", value: keys.length - activeCount, accent: "text-muted-foreground" },
        ].map((s) => (
          <Card key={s.label} className="shadow-sm">
            <CardContent className="pt-5">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className={cn("text-3xl font-bold mt-1", s.accent)}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Keys Table */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            <CardTitle>Your API Keys</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="pl-6">Key Name</TableHead>
                  <TableHead>API Key</TableHead>
                  <TableHead className="hidden md:table-cell">Created</TableHead>
                  <TableHead className="hidden sm:table-cell">Last Used</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keys.map((apiKey) => (
                  <TableRow key={apiKey.id} className="hover:bg-muted/20">
                    <TableCell className="pl-6 font-medium">{apiKey.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                          {visibleKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
                        </code>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                      {apiKey.createdAt}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                      {apiKey.lastUsed ?? <span className="text-muted-foreground/50 italic">Never</span>}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={apiKey.status === "active" ? "default" : "secondary"}
                        className={cn(apiKey.status === "active" && "bg-emerald-500 hover:bg-emerald-600")}
                      >
                        {apiKey.status === "active" ? "Active" : "Revoked"}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          title={visibleKeys.has(apiKey.id) ? "Hide key" : "Show key"}
                          onClick={() => toggleVisibility(apiKey.id)}
                          disabled={apiKey.status === "revoked"}
                        >
                          {visibleKeys.has(apiKey.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          title="Copy key"
                          onClick={() => handleCopy(apiKey)}
                          disabled={apiKey.status === "revoked"}
                        >
                          {copiedId === apiKey.id
                            ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            : <Copy className="w-4 h-4" />}
                        </Button>
                        {apiKey.status === "active" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            title="Revoke key"
                            onClick={() => handleRevoke(apiKey.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* API Docs */}
      <ApiDocsCard />

      {/* Generate Key Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          {!createdKey ? (
            <>
              <DialogHeader>
                <DialogTitle>Generate New API Key</DialogTitle>
                <DialogDescription>
                  Give your key a descriptive name to identify where it&apos;s used.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Key Name</label>
                  <Input
                    placeholder="e.g. Production, CI/CD, Local Dev"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
                  <Button onClick={handleGenerate} disabled={isGenerating}>
                    {isGenerating ? "Generating..." : "Generate Key"}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  Key Generated Successfully
                </DialogTitle>
                <DialogDescription>
                  Copy and store your key now. You won&apos;t be able to see it again.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border/60">
                  <code className="text-xs font-mono flex-1 break-all text-foreground">{createdKey.key}</code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                    onClick={() => handleCopy(createdKey)}
                  >
                    {copiedId === createdKey.id
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-xs text-amber-600 dark:text-amber-400">
                  ⚠️ This key will only be shown once. Store it in a secure vault or environment variable.
                </div>
                <Button className="w-full" onClick={() => { setShowDialog(false); setCreatedKey(null); }}>
                  Done
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
