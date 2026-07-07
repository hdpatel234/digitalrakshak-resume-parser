import { prisma } from "@/lib/db/prisma";
import { createProvider, toggleProviderActive } from "@/app/actions/provider.actions";
import { Server, CheckCircle, XCircle } from "lucide-react";

export default async function AdminProvidersPage() {
  const providers = await prisma.apiProvider.findMany({
    include: { accounts: { include: { apiKeys: true } }, models: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Providers</h1>
          <p className="text-gray-500 mt-2">Manage backend AI engines (Gemini, OpenAI, DeepSeek).</p>
        </div>
        
        <form action={createProvider} className="flex gap-2">
          <input 
            type="text" 
            name="name" 
            placeholder="New Provider Name" 
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            required 
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            Add Provider
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {providers.map((provider: any) => (
          <div key={provider.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Server className="w-5 h-5 text-blue-500" />
                {provider.name}
              </h2>
              <form action={async () => {
                "use server";
                await toggleProviderActive(provider.id);
              }}>
                <button type="submit" className={`text-sm font-medium px-3 py-1 rounded-full ${provider.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {provider.isActive ? "Active" : "Inactive"}
                </button>
              </form>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Configured Models</h3>
                {provider.models?.length === 0 ? (
                  <p className="text-sm text-gray-500">No models configured.</p>
                ) : (
                  <ul className="space-y-2">
                    {provider.models?.map((model: any) => (
                      <li key={model.id} className="flex justify-between text-sm bg-slate-50 px-3 py-2 rounded border border-slate-100">
                        <span className="font-mono text-gray-800">{model.modelName}</span>
                        <span className="text-gray-500">₹{model.costPerRequest}/req</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Accounts & Keys</h3>
                {provider.accounts?.length === 0 ? (
                  <p className="text-sm text-gray-500">No routing accounts configured.</p>
                ) : (
                  <ul className="space-y-4">
                    {provider.accounts?.map((account: any) => (
                      <li key={account.id} className="text-sm bg-slate-50 p-3 rounded border border-slate-100">
                        <div className="font-semibold text-gray-800 mb-2">{account.name}</div>
                        <div className="space-y-1">
                          {account.apiKeys?.map((key: any) => (
                            <div key={key.id} className="flex justify-between items-center text-xs">
                              <span className="font-mono text-gray-500 truncate w-32">{key.keyEncrypted}</span>
                              {key.isExhausted ? <XCircle className="w-3 h-3 text-red-500" /> : <CheckCircle className="w-3 h-3 text-green-500" />}
                            </div>
                          ))}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
