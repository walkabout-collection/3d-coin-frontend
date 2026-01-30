"use client";
import { useRouter } from "next/navigation";
import {
  useQuickBooksStatus,
  useDisconnectQuickBooks,
} from "@/src/hooks/useQueries";
import { toast } from "react-toastify";
import Button from "@/src/components/common/button/Button";
import { Loader2, AlertCircle, CheckCircle, XCircle } from "lucide-react";

export default function QuickBooksDisconnectPage() {
  const router = useRouter();
  const { data: statusData, isLoading, error, refetch } = useQuickBooksStatus();

  const { mutate: disconnect, isPending: isDisconnecting } =
    useDisconnectQuickBooks({
      onSuccess: () => {
        toast.success("QuickBooks disconnected successfully");
        // Redirect to payment method page after disconnect
        setTimeout(() => {
          router.push("/dashboard/payment-method");
        }, 1500);
      },
      onError: (error) => {
        const msg = error instanceof Error ? error.message : String(error);
        toast.error(msg || "Failed to disconnect QuickBooks account");
      },
    });

  const handleDisconnect = () => {
    if (
      window.confirm(
        "Are you sure you want to disconnect your QuickBooks account? You will need to reconnect to access QuickBooks features.",
      )
    ) {
      disconnect();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#1a2a3a] mx-auto mb-4" />
          <p className="text-gray-600">Loading QuickBooks status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Error Loading Status
          </h1>
          <p className="text-gray-600 mb-6">
            Failed to load QuickBooks connection status. Please try again.
          </p>
          <Button
            variant="primary"
            onClick={() => refetch()}
            className="w-full"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const status = statusData?.data;
  const isConnected = status?.connected ?? false;
  const isExpired = status?.expired ?? false;

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
              <XCircle className="h-12 w-12 text-yellow-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Not Connected
          </h1>
          <p className="text-gray-600 mb-6">
            Your QuickBooks account is not connected. Connect your account to
            use QuickBooks features.
          </p>
          <div className="space-y-3">
            <Button
              variant="primary"
              onClick={() => router.push("/dashboard/payment-method")}
              className="w-full"
            >
              Connect QuickBooks
            </Button>
            <Button
              variant="ternary"
              onClick={() => router.push("/dashboard")}
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            {isExpired ? (
              <XCircle className="h-12 w-12 text-red-600" />
            ) : (
              <CheckCircle className="h-12 w-12 text-green-600" />
            )}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          QuickBooks Connected
        </h1>

        {status?.connectedAt && (
          <p className="text-gray-600 mb-2">
            Connected:{" "}
            {new Date(status.connectedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}

        {isExpired && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              Your QuickBooks connection has expired. Please reconnect to
              continue using QuickBooks features.
            </p>
          </div>
        )}

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700 mb-4">
            Disconnecting your QuickBooks account will prevent you from:
          </p>
          <ul className="text-sm text-gray-600 text-left space-y-2 list-disc list-inside">
            <li>Creating invoices in QuickBooks</li>
            <li>Syncing payment transactions</li>
            <li>Viewing QuickBooks transactions</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Button
            variant="primary"
            onClick={handleDisconnect}
            disabled={isDisconnecting}
            className="w-full !bg-red-600 hover:!bg-red-700"
          >
            {isDisconnecting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Disconnecting...
              </>
            ) : (
              "Disconnect QuickBooks"
            )}
          </Button>
          <Button
            variant="ternary"
            onClick={() => router.push("/dashboard/payment-method")}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
