"use client";
import React from "react";
import { Quote } from "@/src/containers/quotes/types";
import Button from "@/src/components/common/button/Button";

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
    payments?: Array<{ status: string }>,
  ) => {
    text: string;
    color: string;
  };
}

/**
 * Quote Card Component
 * Shows payment options for approved quotes
 */
const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  isCreatingCheckout,
  processingQuoteId,
  onStripePayment,
  onManualPayment,
  getQuoteStatusDisplay,
}) => {
  // Check if quote is paid from multiple sources
  const hasPaymentSuccess =
    quote.Payment &&
    Array.isArray(quote.Payment) &&
    quote.Payment.some((p) => p.status === "SUCCESS");

  const isPaid =
    quote.isPaid ||
    quote.paymentStatus === "PAID" ||
    quote.paymentStatus === "SUCCESS" ||
    hasPaymentSuccess;

  // Determine if payment button should be shown
  // Only show button for APPROVED quotes with STRIPE method that are not paid
  const shouldShowPaymentButton =
    quote.status === "APPROVED" &&
    quote.amount &&
    !isPaid &&
    quote.method === "STRIPE";

  // Determine if manual payment button should be shown
  const shouldShowManualPaymentButton =
    quote.status === "APPROVED" &&
    quote.amount &&
    !isPaid &&
    quote.method === "MANUAL";

  const statusDisplay = getQuoteStatusDisplay(
    quote.status,
    quote.paymentStatus,
    isPaid,
    quote.Payment,
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
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        {isPaid ? (
          <div className="text-xs text-green-600 font-semibold">
            Payment Completed
          </div>
        ) : shouldShowPaymentButton ? (
          <Button
            variant="primary"
            onClick={() => onStripePayment(quote)}
            disabled={isCreatingCheckout || processingQuoteId === quote.id}
            className="text-xs px-3 py-1 rounded-full max-w-[140px]"
          >
            {isCreatingCheckout || processingQuoteId === quote.id
              ? "Processing..."
              : "Pay with Card"}
          </Button>
        ) : shouldShowManualPaymentButton ? (
          <Button
            variant="primary"
            onClick={() => onManualPayment(quote)}
            className="text-xs px-3 py-1 rounded-full max-w-[140px]"
          >
            Upload Payment Proof
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default QuoteCard;
