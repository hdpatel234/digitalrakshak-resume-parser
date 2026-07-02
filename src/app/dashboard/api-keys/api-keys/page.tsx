"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Key, AlertCircle, Copy, Check, Trash2 } from "lucide-react";

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKeyName, setNewKeyName] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    setLoading(true);
    const res = await fetch("/api/settings/keys");
    const data = await res.json();
    if (data.success) {
      setKeys(data.keys);
    }
    setLoading(false);
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
      toast.error("Please enter a key name.");
      return;
    }

    const res = await fetch("/api/settings/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", name: newKeyName })
    });

    const data = await res.json();
    if (data.success) {
      toast.success("API Key generated securely.");
      setNewKeyName("");
      fetchKeys();
    } else {
      toast.error(data.error);
    }
  };

  const handleDeactivate = async (keyId: string) => {
    const res = await fetch("/api/settings/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "deactivate", keyId })
    });

    if (res.ok) {
      toast.success("API Key deactivated.");
      fetchKeys();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">API Keys</h1>
        <p className="text-gray-500 mt-2">Manage your secret keys for external API access.</p>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded-r-lg">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-blue-500" />
          <p className="ml-3 text-sm text-blue-700">
            Keep your API keys secret. Do not share them publicly or commit them to client-side code.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Generate New Key</h2>
        <div className="flex gap-4">
          <input
            type="text"
            className="flex-1 h-10 rounded-md border border-gray-300 px-3 text-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Production Server"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
          />
          <button
            onClick={handleCreateKey}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Key className="w-4 h-4" /> Generate Secret Key
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Secret Key</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">Loading keys...</td></tr>
            ) : keys.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">No API keys found.</td></tr>
            ) : (
              keys.map((key) => (
                <tr key={key.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{key.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500 flex items-center gap-2">
                    {key.key.substring(0, 12)}...{key.key.substring(key.key.length - 4)}
                    <button onClick={() => copyToClipboard(key.key)} className="text-gray-400 hover:text-blue-600">
                      {copiedKey === key.key ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${key.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {key.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(key.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {key.isActive && (
                      <button onClick={() => handleDeactivate(key.id)} className="text-red-600 hover:text-red-900 flex items-center justify-end gap-1 w-full">
                        <Trash2 className="w-4 h-4" /> Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
