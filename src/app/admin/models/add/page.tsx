"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AddModelPage() {
  const router = useRouter();
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [providerId, setProviderId] = useState("");
  const [modelName, setModelName] = useState("");
  const [costPerRequest, setCostPerRequest] = useState("0");
  const [maxRequestsPerMin, setMaxRequestsPerMin] = useState("");
  const [maxDailyLimit, setMaxDailyLimit] = useState("");
  const [tokenLimit, setTokenLimit] = useState("");

  useEffect(() => {
    fetch("/api/admin/providers")
      .then(res => res.json())
      .then(data => {
        setProviders(data);
        if (data.length > 0) setProviderId(data[0].id);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!providerId || !modelName) return;
    
    setLoading(true);

    const payload = {
      providerId,
      modelName,
      costPerRequest: parseFloat(costPerRequest) || 0,
      maxRequestsPerMin: maxRequestsPerMin ? parseInt(maxRequestsPerMin) : null,
      maxDailyLimit: maxDailyLimit ? parseInt(maxDailyLimit) : null,
      tokenLimit: tokenLimit ? parseInt(tokenLimit) : null,
      isActive: true
    };

    const res = await fetch("/api/admin/models", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" }
    });

    if (res.ok) {
      router.push("/admin/models");
    } else {
      setLoading(false);
      const err = await res.json();
      alert(`Failed to add model: ${err.error || 'Unknown error'}`);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Add AI Model</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 border rounded-xl shadow-sm">
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Provider</label>
          <select 
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={providerId}
            onChange={(e) => setProviderId(e.target.value)}
            required
          >
            {providers.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Model Identifier (e.g. gpt-4o, gemini-1.5-pro)</label>
          <input 
            type="text" 
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            placeholder="deepseek-chat"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Cost per Request ($)</label>
            <input 
              type="number" 
              step="0.00001"
              className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={costPerRequest}
              onChange={(e) => setCostPerRequest(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Max Requests / Min</label>
            <input 
              type="number" 
              className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={maxRequestsPerMin}
              onChange={(e) => setMaxRequestsPerMin(e.target.value)}
              placeholder="e.g. 60 (Optional)"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Max Daily Limit</label>
            <input 
              type="number" 
              className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={maxDailyLimit}
              onChange={(e) => setMaxDailyLimit(e.target.value)}
              placeholder="e.g. 10000 (Optional)"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Max Token Limit / Req</label>
            <input 
              type="number" 
              className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={tokenLimit}
              onChange={(e) => setTokenLimit(e.target.value)}
              placeholder="e.g. 128000 (Optional)"
            />
          </div>
        </div>
        
        <div className="pt-6 flex gap-4 border-t">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Model"}
          </Button>
        </div>
      </form>
    </div>
  );
}
