"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { handleQuickBooksCallback } from "@/src/services/apiServices";
import { toast } from "react-toastify";

function QuickBooksCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<"processing" | "success" | "error">(
    "processing",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Extract OAuth parameters from URL
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const realmId = searchParams.get("realmId");
        const error = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        // Handle OAuth errors from QuickBooks
        if (error) {
          const message =
            errorDescription ||
            error ||
            "QuickBooks authorization was denied or failed.";
          setErrorMessage(message);
          setStatus("error");
          toast.error(message);

          // Redirect to error page after 3 seconds
          setTimeout(() => {
            router.push(
              "/payment/quickbooks/error?message=" +
                encodeURIComponent(message),
            );
          }, 3000);
          return;
        }

        // Validate required parameters
        if (!code || !state) {
          const message =
            "Missing required OAuth parameters. Please try connecting again.";
          setErrorMessage(message);
          setStatus("error");
          toast.error(message);

          setTimeout(() => {
            router.push(
              "/payment/quickbooks/error?message=" +
                encodeURIComponent(message),
            );
          }, 3000);
          return;
        }

        // Call backend to exchange code for tokens
        const response = await handleQuickBooksCallback({
          code,
          state,
          realmId: realmId || undefined,
        });

        if (response.success && response.data.connected) {
          setStatus("success");
          toast.success(
            `Successfully connected to QuickBooks${response.data.companyName ? ` (${response.data.companyName})` : ""}`,
          );

          // Invalidate and refetch QuickBooks status queries
          await queryClient.invalidateQueries({
            queryKey: ["quickBooksStatus"],
          });
          await queryClient.invalidateQueries({
            queryKey: ["quickBooksConnectionStatus"],
          });
          await queryClient.invalidateQueries({
            queryKey: ["admin", "quickbooks", "connections"],
          });

          // Clear OAuth redirect flag
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("quickbooks_oauth_redirect");
            sessionStorage.removeItem("quickbooks_oauth_started");
          }

          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            router.push("/dashboard");
          }, 2000);
        } else {
          const message =
            response.message || "Failed to complete QuickBooks connection.";
          setErrorMessage(message);
          setStatus("error");
          toast.error(message);

          setTimeout(() => {
            router.push(
              "/payment/quickbooks/error?message=" +
                encodeURIComponent(message),
            );
          }, 3000);
        }
      } catch (error) {
        console.error("QuickBooks callback error:", error);
        const message =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred during QuickBooks connection.";
        setErrorMessage(message);
        setStatus("error");
        toast.error(message);

        setTimeout(() => {
          router.push(
            "/payment/quickbooks/error?message=" + encodeURIComponent(message),
          );
        }, 3000);
      }
    };

    processCallback();
  }, [searchParams, router, queryClient]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {status === "processing" && (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Connecting QuickBooks...
            </h1>
            <p className="text-gray-600">
              Please wait while we complete your QuickBooks connection.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              QuickBooks Connected!
            </h1>
            <p className="text-gray-600 mb-4">
              Your QuickBooks account has been successfully connected.
            </p>
            <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="h-12 w-12 text-red-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Connection Failed
            </h1>
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-800">{errorMessage}</p>
              </div>
            )}
            <p className="text-sm text-gray-500">
              Redirecting to error page...
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function QuickBooksCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                <Loader2 className="h-12 w-12 text-gray-400 animate-pulse" />
              </div>
            </div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <QuickBooksCallbackContent />
    </Suspense>
  );
}
