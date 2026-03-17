"use client";
import React from "react";
import {
  useQuickBooksStatus,
  useConnectQuickBooks,
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

interface QuickBooksConnectionGuideProps {
  onConnectionChange?: (connected: boolean) => void;
}

const QuickBooksConnectionGuide: React.FC<QuickBooksConnectionGuideProps> = ({
  onConnectionChange,
}) => {
  const queryClient = useQueryClient();
  const { data: statusData, isLoading, error, refetch } = useQuickBooksStatus();

  const { mutate: connect, isPending: isConnecting } = useConnectQuickBooks({
    onSuccess: (response) => {
      if (response.success && response.data?.authUri) {
        // Validate authUri before redirecting
        if (
          !response.data.authUri ||
          !response.data.authUri.startsWith("http")
        ) {
          toast.error(
            "Invalid authorization URL received. Please check backend configuration.",
            { autoClose: 6000 },
          );
          sessionStorage.removeItem("quickbooks_oauth_redirect");
          return;
        }

        // Log for debugging (remove in production if needed)
        console.log("Redirecting to QuickBooks OAuth:", response.data.authUri);

        // Redirect to QuickBooks OAuth
        window.location.href = response.data.authUri;
      } else {
        toast.error(
          response.message || "Failed to initiate QuickBooks connection",
          { autoClose: 5000 },
        );
        sessionStorage.removeItem("quickbooks_oauth_redirect");
      }
    },
    onError: (error) => {
      // Clear OAuth state on error
      sessionStorage.removeItem("quickbooks_oauth_redirect");
      sessionStorage.removeItem("quickbooks_oauth_started");

      let errorMessage = "Failed to connect QuickBooks";

      // Enhanced error handling for common OAuth issues
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: {
            status?: number;
            data?: { message?: string; code?: string };
          };
          message?: string;
        };

        const responseData = axiosError.response?.data;
        const status = axiosError.response?.status;

        if (responseData?.message) {
          errorMessage = responseData.message;
        }

        // Handle specific error cases
        if (status === 500) {
          errorMessage =
            "Backend configuration error. Please verify QuickBooks credentials and redirect URI settings.";
        } else if (status === 400) {
          errorMessage =
            "Invalid request. Please ensure QuickBooks app is properly configured in Developer Portal.";
        } else if (responseData?.code === "ERR_OAUTH") {
          errorMessage =
            "OAuth configuration error. Please check backend environment variables match Developer Portal settings.";
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      // Use the error utility for consistent error messages
      const finalErrorMessage = getQuickBooksErrorMessage(error);
      toast.error(finalErrorMessage, {
        autoClose: 6000,
      });
    },
  });

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

  const handleConnect = () => {
    // Prevent multiple simultaneous connection attempts
    if (isConnecting) {
      toast.warning("Connection already in progress. Please wait...");
      return;
    }

    // Check if there's a recent OAuth attempt (within last 30 seconds)
    if (typeof window !== "undefined") {
      const lastAttempt = sessionStorage.getItem("quickbooks_oauth_started");
      if (lastAttempt) {
        const timeSinceLastAttempt = Date.now() - parseInt(lastAttempt, 10);
        if (timeSinceLastAttempt < 30000) {
          // Less than 30 seconds ago
          toast.warning(
            "Please wait before trying again. Authorization codes can only be used once.",
            { autoClose: 5000 },
          );
          return;
        }
      }
    }

    // Clear any previous OAuth state to start fresh
    if (typeof window !== "undefined") {
      // Remove any old OAuth flags
      sessionStorage.removeItem("quickbooks_oauth_redirect");
      // Mark that we're initiating a new OAuth flow
      sessionStorage.setItem("quickbooks_oauth_redirect", "pending");
      // Store timestamp to detect stale OAuth attempts
      sessionStorage.setItem("quickbooks_oauth_started", Date.now().toString());
    }
    // The connect() function will redirect to QuickBooks OAuth
    // After OAuth, QuickBooks redirects to /payment/quickbooks/callback
    connect();
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
