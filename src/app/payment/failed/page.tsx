import Link from "next/link";
import { XCircle } from "lucide-react";

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 text-center space-y-6">
        <div className="flex justify-center">
          <XCircle className="w-20 h-20 text-red-500" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Payment Failed</h2>
          <p className="text-gray-500 mt-2">
            We couldn't process your payment. Please check your payment details and try again.
          </p>
        </div>
        <div className="pt-4 flex flex-col gap-3">
          <Link
            href="/pricing"
            className="w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Try Again
          </Link>
          <Link
            href="/dashboard"
            className="w-full inline-flex justify-center items-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
