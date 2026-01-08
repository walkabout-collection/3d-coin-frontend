"use client";
import React from "react";
import {
  useQuickBooksConnectionStatus,
  useDisconnectQuickBooks,
} from "@/src/hooks/useQueries";
import { toast } from "react-toastify";
import Button from "../common/button/Button";

interface QuickBooksConnectionStatusProps {
  onReconnect?: () => void;
}

const QuickBooksConnectionStatus: React.FC<QuickBooksConnectionStatusProps> = ({
  onReconnect,
}) => {
  const {
    data: statusData,
    isLoading,
    error,
    refetch,
  } = useQuickBooksConnectionStatus();

  const { mutate: disconnect, isPending: isDisconnecting } =
    useDisconnectQuickBooks({
      onSuccess: () => {
        toast.success("QuickBooks account disconnected successfully");
        refetch();
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
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Checking connection...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 text-sm">
          Failed to check QuickBooks connection status. Please try again.
        </p>
        <Button
          variant="ternary"
          onClick={() => refetch()}
          className="mt-2 text-xs"
        >
          Retry
        </Button>
      </div>
    );
  }

  const isConnected = statusData?.data?.connected ?? false;
  const companyName = statusData?.data?.companyName;
  const connectedAt = statusData?.data?.connectedAt;

  if (!isConnected) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-yellow-800 font-medium text-sm">
              QuickBooks not connected
            </p>
            <p className="text-yellow-700 text-xs mt-1">
              Connect your QuickBooks account to view transactions and manage
              payments.
            </p>
          </div>
          {onReconnect && (
            <Button
              variant="primary"
              onClick={onReconnect}
              className="ml-4 text-xs px-4 py-2"
            >
              Connect
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-green-800 font-medium text-sm">
              QuickBooks Connected
            </p>
          </div>
          {companyName && (
            <p className="text-green-700 text-xs mt-1">
              Company: {companyName}
            </p>
          )}
          {connectedAt && (
            <p className="text-green-600 text-xs mt-1">
              Connected on{" "}
              {new Date(connectedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
        </div>
        <Button
          variant="ternary"
          onClick={handleDisconnect}
          disabled={isDisconnecting}
          className="ml-4 text-xs px-3 py-1 rounded-full !bg-red-100 hover:!bg-red-200 text-red-700"
        >
          {isDisconnecting ? "Disconnecting..." : "Disconnect"}
        </Button>
      </div>
    </div>
  );
};

export default QuickBooksConnectionStatus;
