import { prisma } from "@/lib/db/prisma";
import { createModel } from "@/app/actions/provider.actions";
import { Cpu } from "lucide-react";

export default async function AdminModelsPage() {
  const providers = await prisma.apiProvider.findMany({ where: { isActive: true } });
  const models = await prisma.providerModel.findMany({
    include: { provider: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Models</h1>
          <p className="text-gray-500 mt-2">Configure pricing and limits for specific AI models.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Add New Model</h2>
        <form action={createModel} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
            <select name="providerId" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500" required>
              {providers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Model ID</label>
            <input type="text" name="modelName" placeholder="e.g. gpt-4o" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cost Per Request (₹)</label>
            <input type="number" step="0.01" name="costPerRequest" placeholder="0.50" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500" required />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 h-10">
            Save Model
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cost/Req (₹)</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {models.map((model) => (
              <tr key={model.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-gray-400" /> {model.modelName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{model.provider.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${model.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {model.isActive ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                  {model.costPerRequest.toFixed(2)}
                </td>
              </tr>
            ))}
            {models.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No models configured.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
