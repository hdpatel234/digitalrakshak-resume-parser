import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { Activity } from "lucide-react";

export default async function ClientUsagePage() {
  const session = await auth();
  if (!session || !session.user) return null;

  const tenantId = (session.user as any).tenantId;

  const usageLogs = await prisma.clientUsageLog.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { apiKey: true }
  });

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">API Usage Analytics</h1>
        <p className="text-gray-500 mt-2">Monitor your external API consumption and credit deductions.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">API Key</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endpoint</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Credits Used</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usageLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {log.apiKey.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                  {log.endpoint}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-blue-600">
                  {log.creditsUsed}
                </td>
              </tr>
            ))}
            {usageLogs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  <Activity className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                  No API usage recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
