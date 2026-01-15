"use client";
import React, { useState } from "react";
import Image from "next/image";
import Button from "@/src/components/common/button/Button";
import { useQueryClient } from "@tanstack/react-query";

import { useApproveAdminQuote } from "@/src/hooks/useQueries";
import { toast } from "react-toastify";
import { Quote } from "@/src/containers/admin/quotes/types";
import LoadingSpinner from "@/src/components/common/LoadingSpinner";
interface ApproveQuoteModalProps {
  quote: Quote;
  onClose: () => void;
  onApprove: (price: number) => void;
}

const ApproveQuoteModal: React.FC<ApproveQuoteModalProps> = ({
  quote,
  onClose,
}) => {
  const [totalPrice, setTotalPrice] = useState<string>("");
  const [error, setError] = useState<string>("");
  const queryClient = useQueryClient();

  const approveMutation = useApproveAdminQuote({
    onSuccess: () => {
      // Invalidate and refetch quotes and orders to update lists dynamically
      queryClient.invalidateQueries({ queryKey: ["adminQuotes"] });
      queryClient.invalidateQueries({ queryKey: ["userQuotes"] });
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
      queryClient.invalidateQueries({ queryKey: ["userOrders"] });

      toast.success("Quote approved successfully");
      onClose();
    },
    onError: () => {
      toast.error("Failed to approve quote ");
    },
  });

  const handleSubmit = () => {
    const price = parseFloat(totalPrice);
    if (isNaN(price) || price <= 0) {
      setError("Please enter a valid total price greater than 0.");
      return;
    }
    approveMutation.mutate({ id: quote.id, amount: price });
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full relative shadow-md">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <Image
            src="/images/dashboard/cross-icon.svg"
            alt="Close"
            width={14}
            height={14}
          />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Approve Quote</h2>
        <p className="text-gray-600 mb-6">
          Set the total price for the coin and approve the quote.
        </p>

        <div className="mb-6 space-y-2">
          <p>
            <strong>Name:</strong>{" "}
            {quote.user
              ? `${quote.user.firstName} ${quote.user.lastName}`
              : "Customer"}
          </p>
          <p>
            <strong>Order No:</strong>{" "}
            {quote.orderId ? (
              quote.orderId
            ) : (
              <span className="text-gray-500 italic">
                Will be generated on approval
              </span>
            )}
          </p>
          <p>
            <strong>Email:</strong> {quote.email}
          </p>
          {quote.totalCoins !== undefined && (
            <p>
              <strong>Coin Quantity:</strong> {quote.totalCoins}
            </p>
          )}
          <p>
            <strong>Current Status:</strong> {quote.status}
          </p>
        </div>

        <div className="mb-6">
          <label
            htmlFor="totalPrice"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Total Price ($)
          </label>
          <input
            type="number"
            id="totalPrice"
            value={totalPrice}
            onChange={(e) => {
              setTotalPrice(e.target.value);
              setError("");
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Enter total price"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <div className="flex justify-center gap-4">
          <Button
            type="button"
            variant="ternary"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium !bg-gray-200 border-none rounded-full max-w-[120px]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleSubmit}
            disabled={approveMutation.isPending}
            className="px-4 py-2 text-sm font-medium rounded-full max-w-[120px] flex items-center justify-center gap-2"
          >
            {approveMutation.isPending ? (
              <>
                <LoadingSpinner size="sm" className="text-white" />
                <span>Approving...</span>
              </>
            ) : (
              "Approve"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApproveQuoteModal;
