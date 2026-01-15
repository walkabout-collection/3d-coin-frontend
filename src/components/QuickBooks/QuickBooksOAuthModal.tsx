"use client";
import React, { useEffect, useState } from "react";
import {
  useInitiateQuickBooksOAuth,
  useHandleQuickBooksCallback,
} from "@/src/hooks/useQueries";
import { toast } from "react-toastify";
import Button from "../common/button/Button";
import { X, Loader2, Link2 } from "lucide-react";

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

  // Handle escape key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isProcessing) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, isProcessing, onClose]);

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isProcessing) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1a2a3a] rounded-lg flex items-center justify-center">
              <Link2 className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Connect QuickBooks
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
            disabled={isProcessing}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-700 text-sm mb-4 leading-relaxed">
              Connect your QuickBooks account to manage payments and view
              transactions directly from your dashboard.
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-2 mb-4 pl-2">
              <li>View all your QuickBooks transactions</li>
              <li>Sync payment data automatically</li>
              <li>Manage invoices and payments</li>
            </ul>
          </div>

          {isProcessing || isInitiating || isHandlingCallback ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-10 w-10 animate-spin text-[#1a2a3a] mb-4" />
              <span className="text-gray-700 font-medium">
                {isHandlingCallback
                  ? "Completing connection..."
                  : "Connecting to QuickBooks..."}
              </span>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  onClick={handleConnect}
                  disabled={isInitiating}
                  className="flex-1 shadow-md hover:shadow-lg transition-shadow"
                >
                  Connect QuickBooks
                </Button>
                <Button
                  variant="ternary"
                  onClick={onClose}
                  disabled={isProcessing}
                  className="flex-1 border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </Button>
              </div>

              {authUrl && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-800">
                    If the authorization window didn&apos;t open,{" "}
                    <a
                      href={authUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-medium hover:text-blue-900"
                    >
                      click here to authorize
                    </a>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickBooksOAuthModal;
