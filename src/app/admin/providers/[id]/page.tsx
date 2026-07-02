"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ProviderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newAccountName, setNewAccountName] = useState("");
  const [newKeyValues, setNewKeyValues] = useState<Record<string, string>>({});

  const fetchProvider = async () => {
    const res = await fetch(`/api/admin/providers/${params.id}`);
    if (res.ok) {
      setProvider(await res.json());
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProvider();
  }, [params.id]);

  const addAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccountName) return;

    const res = await fetch(`/api/admin/providers/${params.id}/accounts`, {
      method: "POST",
      body: JSON.stringify({ name: newAccountName }),
      headers: { "Content-Type": "application/json" }
    });
    
    if (res.ok) {
      setNewAccountName("");
      fetchProvider();
    }
  };

  const addKey = async (accountId: string) => {
    const key = newKeyValues[accountId];
    if (!key) return;

    const res = await fetch(`/api/admin/providers/accounts/${accountId}/keys`, {
      method: "POST",
      body: JSON.stringify({ key, priority: 0 }),
      headers: { "Content-Type": "application/json" }
    });
    
    if (res.ok) {
      setNewKeyValues({ ...newKeyValues, [accountId]: "" });
      fetchProvider();
    }
  };

  if (loading) return <div className="p-8">Loading provider details...</div>;
  if (!provider) return <div className="p-8 text-red-500">Provider not found</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.push("/admin/providers")}>&larr; Back</Button>
        <h1 className="text-3xl font-bold">{provider.name} Accounts</h1>
      </div>

      <div className="bg-card p-6 border rounded-xl shadow-sm space-y-4">
        <h2 className="text-xl font-semibold">Add New Account</h2>
        <form onSubmit={addAccount} className="flex gap-4">
          <input 
            type="text" 
            className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={newAccountName}
            onChange={(e) => setNewAccountName(e.target.value)}
            placeholder="Account Name (e.g. Finance Dept OpenAI)"
            required
          />
          <Button type="submit">Create Account</Button>
        </form>
      </div>

      <div className="space-y-6">
        {provider.accounts.map((account: any) => (
          <div key={account.id} className="border p-6 rounded-xl bg-card">
            <h3 className="text-lg font-semibold mb-4">{account.name}</h3>
            
            <div className="space-y-3 mb-6">
              {account.apiKeys.map((k: any) => (
                <div key={k.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg text-sm border">
                  <div className="font-mono">{k.hint}</div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">Priority: {k.priority}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${k.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {k.isActive ? "Active" : "Disabled"}
                    </span>
                  </div>
                </div>
              ))}
              {account.apiKeys.length === 0 && (
                <p className="text-sm text-muted-foreground italic">No API keys added yet.</p>
              )}
            </div>

            <div className="flex flex-col gap-2 mt-4 pt-4 border-t">
              <div className="flex gap-4">
                <input 
                  type="text" 
                  className="flex-1 h-9 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newKeyValues[account.id] || ""}
                  onChange={(e) => setNewKeyValues({ ...newKeyValues, [account.id]: e.target.value })}
                  placeholder="Paste API Key (encrypted instantly)"
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  <input 
                    type="number" 
                    className="h-9 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    id={`minLimit-${account.id}`}
                    placeholder="Max Reqs/Min (Opt)"
                  />
                  <input 
                    type="number" 
                    className="h-9 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    id={`hourLimit-${account.id}`}
                    placeholder="Max Reqs/Hour (Opt)"
                  />
                  <input 
                    type="number" 
                    className="h-9 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    id={`dailyLimit-${account.id}`}
                    placeholder="Max Reqs/Day (Opt)"
                  />
                  <input 
                    type="number" 
                    className="h-9 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    id={`monthLimit-${account.id}`}
                    placeholder="Max Reqs/Month (Opt)"
                  />
                </div>
                <Button size="sm" className="w-full mt-2" onClick={() => {
                  const minInput = document.getElementById(`minLimit-${account.id}`) as HTMLInputElement;
                  const hourInput = document.getElementById(`hourLimit-${account.id}`) as HTMLInputElement;
                  const dailyInput = document.getElementById(`dailyLimit-${account.id}`) as HTMLInputElement;
                  const monthInput = document.getElementById(`monthLimit-${account.id}`) as HTMLInputElement;
                  
                  const key = newKeyValues[account.id];
                  if (!key) return;

                  fetch(`/api/admin/providers/accounts/${account.id}/keys`, {
                    method: "POST",
                    body: JSON.stringify({ 
                      key, 
                      priority: 0,
                      limitRequestsPerMin: minInput.value ? parseInt(minInput.value) : null,
                      limitRequestsPerHour: hourInput.value ? parseInt(hourInput.value) : null,
                      limitRequestsDaily: dailyInput.value ? parseInt(dailyInput.value) : null,
                      limitRequestsPerMonth: monthInput.value ? parseInt(monthInput.value) : null
                    }),
                    headers: { "Content-Type": "application/json" }
                  }).then(res => {
                    if (res.ok) {
                      setNewKeyValues({ ...newKeyValues, [account.id]: "" });
                      minInput.value = "";
                      hourInput.value = "";
                      dailyInput.value = "";
                      monthInput.value = "";
                      fetchProvider();
                    }
                  });
                }} disabled={!newKeyValues[account.id]}>
                  Add Key Securely
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
