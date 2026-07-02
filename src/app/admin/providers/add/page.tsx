"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AddProviderPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    
    setLoading(true);
    const res = await fetch("/api/admin/providers", {
      method: "POST",
      body: JSON.stringify({ name, isActive: true }),
      headers: { "Content-Type": "application/json" }
    });

    if (res.ok) {
      router.push("/admin/providers");
    } else {
      setLoading(false);
      alert("Failed to add provider");
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Add AI Provider</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4 bg-card p-6 border rounded-xl shadow-sm">
        <div className="space-y-2">
          <label className="text-sm font-medium">Provider Name (e.g. Gemini, OpenAI)</label>
          <input 
            type="text" 
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="DeepSeek"
            required
          />
        </div>
        
        <div className="pt-4 flex gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Provider"}
          </Button>
        </div>
      </form>
    </div>
  );
}
