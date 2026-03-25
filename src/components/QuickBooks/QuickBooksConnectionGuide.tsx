"use client";
import React from "react";
import {
  useQuickBooksStatus,
  useDisconnectQuickBooks,
} from "@/src/hooks/useQueries";
import { toast } from "react-toastify";
import Button from "../common/button/Button";
import {
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Link2,
} from "lucide-react";
import { getQuickBooksErrorMessage } from "@/src/utils/quickbooksErrors";
import { useQueryClient } from "@tanstack/react-query";
import { beginQuickBooksConnect } from "@/src/utils/quickbooksOAuth";

interface QuickBooksConnectionGuideProps {
  onConnectionChange?: (connected: boolean) => void;
}

const QuickBooksConnectionGuide: React.FC<QuickBooksConnectionGuideProps> = ({
  onConnectionChange,
}) => {
  const queryClient = useQueryClient();
  const { data: statusData, isLoading, error, refetch } = useQuickBooksStatus();
  const [isConnecting, setIsConnecting] = React.useState(false);

  const { mutate: disconnect, isPending: isDisconnecting } =
    useDisconnectQuickBooks({
      onSuccess: () => {
        toast.success("QuickBooks disconnected successfully");
        // Invalidate all QuickBooks-related queries
        queryClient.invalidateQueries({ queryKey: ["quickBooksStatus"] });
        queryClient.invalidateQueries({
          queryKey: ["quickBooksConnectionStatus"],
        });
        queryClient.invalidateQueries({
          queryKey: ["admin", "quickbooks", "connections"],
        });
        refetch();
        onConnectionChange?.(false);
      },
      onError: (error) => {
        const errorMsg = getQuickBooksErrorMessage(error);
        toast.error(errorMsg);
      },
    });

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      await beginQuickBooksConnect({ returnTo: window.location.href });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(msg || "Failed to start QuickBooks connection");
      setIsConnecting(false);
    }
  };

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
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-[#1a2a3a] mb-3" />
        <p className="text-gray-600 text-sm">Checking QuickBooks status...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-800 font-medium text-sm mb-1">
              Failed to check QuickBooks status
            </p>
            <p className="text-red-700 text-xs mb-3">
              Unable to verify your QuickBooks connection. Please try again.
            </p>
            <Button
              variant="ternary"
              onClick={() => refetch()}
              className="text-xs"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const status = statusData?.data;
  const isConnected = status?.connected ?? false;
  const isExpired = status?.expired ?? false;

  if (!isConnected) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Link2 className="h-6 w-6 text-gray-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Connect QuickBooks
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Connect your QuickBooks account to create invoices and sync
              payments automatically.
            </p>
            <Button
              variant="primary"
              onClick={handleConnect}
              disabled={isConnecting}
              className="shadow-md hover:shadow-lg transition-shadow"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Link2 className="h-4 w-4 mr-2" />
                  Connect QuickBooks
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
          {isExpired ? (
            <XCircle className="h-6 w-6 text-red-600" />
          ) : (
            <CheckCircle className="h-6 w-6 text-green-600" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              QuickBooks Connected
            </h3>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                isExpired
                  ? "bg-red-100 text-red-800 border border-red-200"
                  : "bg-green-100 text-green-800 border border-green-200"
              }`}
            >
              {isExpired ? (
                <>
                  <XCircle className="h-3 w-3 mr-1" />
                  Expired
                </>
              ) : (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </>
              )}
            </span>
          </div>

          {status?.connectedAt && (
            <p className="text-gray-600 text-sm mb-2">
              Connected:{" "}
              {new Date(status.connectedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}

          {status?.expiresAt && (
            <p
              className={`text-sm mb-4 ${
                isExpired ? "text-red-600" : "text-gray-600"
              }`}
            >
              Expires:{" "}
              {new Date(status.expiresAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}

          {isExpired && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-yellow-800 text-sm">
                Your QuickBooks connection has expired. Please reconnect to
                continue using QuickBooks features.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            {isExpired && (
              <Button
                variant="primary"
                onClick={handleConnect}
                disabled={isConnecting}
                className="shadow-md hover:shadow-lg transition-shadow"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Reconnecting...
                  </>
                ) : (
                  <>
                    <Link2 className="h-4 w-4 mr-2" />
                    Reconnect
                  </>
                )}
              </Button>
            )}
            <Button
              variant="ternary"
              onClick={handleDisconnect}
              disabled={isDisconnecting}
              className="!bg-red-50 hover:!bg-red-100 text-red-700 border border-red-200"
            >
              {isDisconnecting ? "Disconnecting..." : "Disconnect"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickBooksConnectionGuide;
