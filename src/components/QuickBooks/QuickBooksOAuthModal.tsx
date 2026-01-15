"use client";
import React, { useEffect, useState } from "react";
import {
  useInitiateQuickBooksOAuth,
  useHandleQuickBooksCallback,
} from "@/src/hooks/useQueries";
import { toast } from "react-toastify";
import Button from "../common/button/Button";

interface QuickBooksOAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const QuickBooksOAuthModal: React.FC<QuickBooksOAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [authUrl, setAuthUrl] = useState<string | null>(null);

  const { mutate: initiateOAuth, isPending: isInitiating } =
    useInitiateQuickBooksOAuth({
      onSuccess: (data) => {
        if (data.success && data.data.authUrl) {
          setAuthUrl(data.data.authUrl);
          // Open OAuth URL in a new window
          const authWindow = window.open(
            data.data.authUrl,
            "QuickBooks OAuth",
            "width=600,height=700,scrollbars=yes",
          );

          // Listen for postMessage from callback page
          const messageHandler = (event: MessageEvent) => {
            // Verify origin for security (adjust based on your backend URL)
            if (
              event.data.type === "QUICKBOOKS_OAUTH_CALLBACK" &&
              event.data.code &&
              event.data.state
            ) {
              window.removeEventListener("message", messageHandler);
              handleCallback({
                code: event.data.code,
                state: event.data.state,
                realmId: event.data.realmId,
              });
              if (authWindow && !authWindow.closed) {
                authWindow.close();
              }
            }
          };

          window.addEventListener("message", messageHandler);

          // Fallback: Check URL parameters in main window (for redirect flow)
          const checkCallback = setInterval(() => {
            try {
              const urlParams = new URLSearchParams(window.location.search);
              const code = urlParams.get("code");
              const state = urlParams.get("state");
              const realmId = urlParams.get("realmId");

              if (code && state) {
                clearInterval(checkCallback);
                window.removeEventListener("message", messageHandler);
                handleCallback({ code, state, realmId: realmId || undefined });
                if (authWindow && !authWindow.closed) {
                  authWindow.close();
                }
                // Clean up URL parameters
                const newUrl = window.location.pathname;
                window.history.replaceState({}, "", newUrl);
              }
            } catch (error) {
              console.error("Error checking callback:", error);
            }
          }, 1000);

          // Cleanup after 5 minutes
          setTimeout(() => {
            clearInterval(checkCallback);
            window.removeEventListener("message", messageHandler);
            if (authWindow && !authWindow.closed) {
              authWindow.close();
            }
          }, 300000);
        } else {
          toast.error(
            data.message || "Failed to initiate QuickBooks connection",
          );
        }
      },
      onError: (error) => {
        const msg = error instanceof Error ? error.message : String(error);
        toast.error(msg || "Failed to initiate QuickBooks OAuth");
        setIsProcessing(false);
      },
    });

  const { mutate: handleCallback, isPending: isHandlingCallback } =
    useHandleQuickBooksCallback({
      onSuccess: (data) => {
        if (data.success && data.data.connected) {
          toast.success(
            `Successfully connected to QuickBooks${data.data.companyName ? ` (${data.data.companyName})` : ""}`,
          );
          onSuccess();
          onClose();
        } else {
          toast.error(data.message || "Failed to connect QuickBooks account");
        }
        setIsProcessing(false);
      },
      onError: (error) => {
        const msg = error instanceof Error ? error.message : String(error);
        toast.error(msg || "Failed to complete QuickBooks connection");
        setIsProcessing(false);
      },
    });

  // Check for OAuth callback in URL on mount
  useEffect(() => {
    if (isOpen) {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const state = urlParams.get("state");
      const realmId = urlParams.get("realmId");

      if (code && state) {
        setIsProcessing(true);
        handleCallback({ code, state, realmId: realmId || undefined });
      }
    }
  }, [isOpen, handleCallback]);

  const handleConnect = () => {
    setIsProcessing(true);
    initiateOAuth();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Connect QuickBooks
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
            disabled={isProcessing}
          >
            ×
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 text-sm mb-4">
            Connect your QuickBooks account to manage payments and view
            transactions directly from your dashboard.
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-2 mb-4">
            <li>View all your QuickBooks transactions</li>
            <li>Sync payment data automatically</li>
            <li>Manage invoices and payments</li>
          </ul>
        </div>

        {isProcessing || isInitiating || isHandlingCallback ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">
              {isHandlingCallback
                ? "Completing connection..."
                : "Connecting to QuickBooks..."}
            </span>
          </div>
        ) : (
          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={handleConnect}
              disabled={isInitiating}
              className="flex-1"
            >
              Connect QuickBooks
            </Button>
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        )}

        {authUrl && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              If the authorization window didn&apos;t open,{" "}
              <a
                href={authUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-medium"
              >
                click here to authorize
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickBooksOAuthModal;
