import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { FileJson, Clock, CheckCircle, XCircle } from "lucide-react";

export default async function ParsedResumesPage() {
  const session = await auth();
  if (!session || !session.user) return null;

  const tenantId = (session.user as any).tenantId;

  const uploads = await prisma.resumeUpload.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
    include: { parsedResult: true }
  });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Parsed Resumes</h1>
        <p className="text-gray-500 mt-2">View the structured JSON output of your historical resume extractions.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tokens Used</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {uploads.map((upload) => (
              <tr key={upload.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center gap-2">
                  <FileJson className="w-4 h-4 text-gray-400" />
                  {upload.fileName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(upload.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {upload.status === "COMPLETED" ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3" /> Extracted
                    </span>
                  ) : upload.status === "FAILED" ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800" title={upload.error || ""}>
                      <XCircle className="w-3 h-3" /> Failed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <Clock className="w-3 h-3" /> Processing
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {upload.parsedResult?.tokensUsed || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {upload.status === "COMPLETED" && upload.parsedResult ? (
                    <details className="relative">
                      <summary className="text-blue-600 hover:text-blue-900 cursor-pointer list-none flex justify-end gap-1 items-center">
                        View JSON
                      </summary>
                      <div className="absolute right-0 top-8 w-96 bg-gray-900 rounded-lg shadow-xl p-4 z-10 max-h-96 overflow-y-auto text-left">
                        <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">
                          {JSON.stringify(upload.parsedResult.data, null, 2)}
                        </pre>
                      </div>
                    </details>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            ))}
            {uploads.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No resumes parsed yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
