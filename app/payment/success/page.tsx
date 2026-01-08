"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Button from "@/src/components/common/button/Button";
import { CheckCircle, Download, Loader2 } from "lucide-react";
import SaveCardAfterCheckout from "@/src/components/SaveCardAfterCheckout";
import {
  usePaymentReceipt,
  useGeneratePaymentReceipt,
  usePaymentIdFromSession,
} from "@/src/hooks/useQueries";
import { usePaymentMethodFromSession } from "@/src/hooks/useQueries";
import { toast } from "react-toastify";

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showSaveCard, setShowSaveCard] = useState(true);
  const [cardSaved, setCardSaved] = useState(false);

  // Get payment ID from session
  const { data: paymentIdData } = usePaymentIdFromSession(sessionId);
  const paymentId = paymentIdData?.data?.paymentId;

  // Get receipt for this payment
  const { data: receiptData, isLoading: isLoadingReceipt } = usePaymentReceipt(
    paymentId || null,
  );
  const { mutate: generateReceipt, isPending: isGenerating } =
    useGeneratePaymentReceipt({
      onSuccess: (data) => {
        if (data.success && data.data.receiptUrl) {
          window.open(data.data.receiptUrl, "_blank");
          toast.success("Receipt generated successfully");
        }
      },
      onError: (error) => {
        const msg = error instanceof Error ? error.message : String(error);
        toast.error(msg || "Failed to generate receipt");
      },
    });

  // Check if user is logged in
  const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  };

  const isLoggedIn = !!getCookie("token");

  useEffect(() => {
    const session_id = searchParams.get("session_id");
    setSessionId(session_id);
  }, [searchParams]);

  const handleCardSaved = () => {
    setCardSaved(true);
    setShowSaveCard(false);
  };

  const handleSkip = () => {
    setShowSaveCard(false);
  };

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
        </div>

        {/* Show save card prompt for logged-in users with Stripe session */}
        {showSaveCard && isLoggedIn && sessionId && (
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
        )}

        {/* Receipt Section */}
        {paymentId && (
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
        )}

        <div className="flex flex-col gap-3">
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

export default PaymentSuccessPage;
