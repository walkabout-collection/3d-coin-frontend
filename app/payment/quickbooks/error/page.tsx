"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { XCircle, AlertCircle } from "lucide-react";
import Button from "@/src/components/common/button/Button";

export default function QuickBooksErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message =
    searchParams.get("message") ||
    "An error occurred while connecting QuickBooks";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="h-12 w-12 text-red-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Connection Failed
        </h1>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 text-left">{message}</p>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            variant="primary"
            onClick={() => router.push("/dashboard/payment-method")}
            className="w-full"
          >
            Try Again
          </Button>
          <Button
            variant="ternary"
            onClick={() => router.push("/dashboard")}
            className="w-full"
          >
            Go to Dashboard
          </Button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            If this problem persists, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
}
