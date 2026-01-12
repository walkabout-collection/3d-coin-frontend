"use client";
import React from "react";
import { Quote } from "@/src/containers/quotes/types";
import Button from "@/src/components/common/button/Button";
import { useQuoteCanProceed } from "@/src/hooks/useQueries";

interface QuoteCardProps {
  quote: Quote;
  isCreatingCheckout: boolean;
  processingQuoteId: string | null;
  onStripePayment: (quote: Quote) => void;
  onManualPayment: (quote: Quote) => void;
  getQuoteStatusDisplay: (
    status: string,
    paymentStatus?: string,
    isPaid?: boolean,
  ) => {
    text: string;
    color: string;
  };
}

/**
 * Quote Card Component
 * Uses checkQuoteCanProceed API to determine if payment button should be shown
 */
const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  isCreatingCheckout,
  processingQuoteId,
  onStripePayment,
  onManualPayment,
  getQuoteStatusDisplay,
}) => {
  // Check if quote can proceed using the API
  const { data: canProceedData, isLoading: isLoadingCanProceed } =
    useQuoteCanProceed(quote.id, {
      enabled: quote.status === "APPROVED", // Only check if quote is approved
      staleTime: 5000, // Cache for 5 seconds
    });

  const canProceed = canProceedData?.canProceed ?? false;
  const paymentStatus = canProceedData?.paymentStatus;
  const isPaid = paymentStatus === "PAID";
  const orderExists = canProceedData?.orderExists ?? false;

  // Determine if payment button should be shown
  // According to document: Show button if APPROVED, UNPAID, and no order exists
  const shouldShowPaymentButton =
    quote.status === "APPROVED" &&
    quote.amount &&
    canProceed &&
    !isPaid &&
    !orderExists &&
    (quote.method === "STRIPE" || quote.method === "MANUAL");

  const statusDisplay = getQuoteStatusDisplay(
    quote.status,
    paymentStatus || undefined,
    isPaid,
  );

  return (
    <div className="bg-gray-100 p-6 rounded-lg flex justify-between items-center">
      <div className="flex-1">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-md font-bold text-black">Order No:</span>
            <span className="text-sm text-gray-900">
              {quote.orderId ? (
                quote.orderId
              ) : (
                <span className="text-gray-500 italic">
                  Pending Order Number
                </span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-md font-bold text-black">Email:</span>
            <span className="text-sm text-gray-900">
              {quote.email ?? quote.user?.email}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-md font-bold text-black">Amount:</span>
            <span className="text-sm text-gray-900">
              {quote.amount ? `$${quote.amount.toFixed(2)}` : "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-md font-bold text-black">Status:</span>
            <span
              className={`text-sm px-2 py-1 rounded ${statusDisplay.color}`}
            >
              {statusDisplay.text}
            </span>
          </div>
          {canProceedData && !canProceed && canProceedData.reason && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-gray-500 italic">
                {canProceedData.reason}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        {isLoadingCanProceed ? (
          <div className="text-xs text-gray-500">Checking status...</div>
        ) : shouldShowPaymentButton ? (
          <div className="flex flex-col gap-2 mt-2">
            {quote.method === "STRIPE" && (
              <Button
                variant="primary"
                onClick={() => onStripePayment(quote)}
                disabled={isCreatingCheckout || processingQuoteId === quote.id}
                className="text-xs px-3 py-1 rounded-full max-w-[140px]"
              >
                {isCreatingCheckout || processingQuoteId === quote.id
                  ? "Processing..."
                  : "Pay with Credit Card"}
              </Button>
            )}
            {quote.method === "MANUAL" && (
              <Button
                variant="primary"
                onClick={() => onManualPayment(quote)}
                className="text-xs px-3 py-1 rounded-full max-w-[140px]"
              >
                Upload Payment Proof
              </Button>
            )}
          </div>
        ) : isPaid && orderExists && canProceedData?.orderId ? (
          <div className="text-xs text-green-600 font-semibold">
            Payment Completed
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default QuoteCard;
