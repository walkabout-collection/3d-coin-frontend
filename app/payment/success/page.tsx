"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Button from "@/src/components/common/button/Button";
import { CheckCircle, Loader2 } from "lucide-react";
import { usePaymentIdFromSession } from "@/src/hooks/useQueries";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const PaymentSuccessContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [paymentVerified, setPaymentVerified] = useState(false);

  // Get payment ID from session
  const {
    data: paymentIdData,
    isLoading: isLoadingPaymentId,
    isError: isPaymentIdError,
  } = usePaymentIdFromSession(sessionId);

  useEffect(() => {
    const session_id = searchParams.get("session_id");
    setSessionId(session_id);
  }, [searchParams]);

  // Handle payment verification when payment ID is retrieved
  useEffect(() => {
    if (paymentIdData?.success && paymentIdData?.data?.paymentId) {
      setPaymentVerified(true);
      // Payment ID retrieved successfully - backend webhook should have
      // already marked the payment as successful and updated quote status

      // If payment status is SUCCESS, invalidate quotes and payment notifications queries
      if (paymentIdData.data.status === "SUCCESS") {
        // Invalidate quotes query so it refetches with updated payment status
        queryClient.invalidateQueries({ queryKey: ["userQuotes"] });
        // Invalidate payment notifications so quotes can use the latest payment status
        queryClient.invalidateQueries({ queryKey: ["paymentNotifications"] });
      }
    }
  }, [paymentIdData, queryClient]);

  // Handle errors silently (payment may still be processing)
  useEffect(() => {
    if (isPaymentIdError) {
      console.error("Failed to get payment ID from session");
      // Don't show error to user as payment may still be processing
    }
  }, [isPaymentIdError]);

  // Show loading state while verifying payment
  if (isLoadingPaymentId && sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Verifying payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            Your payment has been processed successfully. Your order has been
            created and you will receive a confirmation email shortly.
          </p>
          {paymentVerified && paymentIdData?.data?.paymentId && (
            <p className="text-sm text-gray-500 mb-4">
              Payment ID: {paymentIdData.data.paymentId.substring(0, 8)}...
            </p>
          )}
        </div>

        {/* Show save card prompt for logged-in users with Stripe session */}
        {/* {showSaveCard && isLoggedIn && sessionId && (
          <div className="mb-6">
            <SaveCardAfterCheckout
              sessionId={sessionId}
              onSaved={handleCardSaved}
              onSkip={handleSkip}
            />
          </div>
        )}

        {cardSaved && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 text-sm">
              ✓ Your card has been saved successfully!
            </p>
          </div>
        )} */}

        {/* Receipt Section */}
        {/* {paymentId && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">
                  Payment Receipt
                </h3>
                {isLoadingReceipt ? (
                  <p className="text-blue-700 text-sm flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Checking receipt status...
                  </p>
                ) : receiptData?.data?.receiptUrl ? (
                  <p className="text-blue-700 text-sm">
                    Receipt is ready for download
                  </p>
                ) : (
                  <p className="text-blue-700 text-sm">
                    Receipt will be generated automatically
                  </p>
                )}
              </div>
              <div>
                {receiptData?.data?.receiptUrl ? (
                  <Button
                    variant="primary"
                    onClick={() =>
                      window.open(receiptData.data.receiptUrl, "_blank")
                    }
                    className="rounded-full py-2 px-4 text-sm flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Receipt
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={() => generateReceipt(paymentId)}
                    disabled={isGenerating}
                    className="rounded-full py-2 px-4 text-sm flex items-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        Generate Receipt
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )} */}

        <div className="flex flex-col gap-3">
          <Button
            variant="primary"
            onClick={() => router.push("/dashboard/quotes")}
            className="w-full rounded-full py-3"
          >
            View Quotes
          </Button>
          <Button
            variant="primary"
            onClick={() => router.push("/dashboard/orders")}
            className="w-full rounded-full py-3"
          >
            View Orders
          </Button>
          <Button
            variant="ternary"
            onClick={() => router.push("/dashboard")}
            className="w-full rounded-full py-3 !bg-gray-200"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

const PaymentSuccessPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
};

export default PaymentSuccessPage;
