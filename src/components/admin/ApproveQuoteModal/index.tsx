"use client";
import React, { useState, useEffect } from "react";
import Button from "@/src/components/common/button/Button";
import { useQueryClient } from "@tanstack/react-query";
import { useApproveAdminQuote } from "@/src/hooks/useQueries";
import { toast } from "react-toastify";
import { Quote } from "@/src/containers/admin/quotes/types";
import LoadingSpinner from "@/src/components/common/LoadingSpinner";
import { X, DollarSign } from "lucide-react";
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

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full relative transform transition-all animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1a2a3a] rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Approve Quote</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-6 leading-relaxed">
            Set the total price for the coin and approve the quote.
          </p>

          <div className="mb-6 space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Name:</span>
              <span className="text-sm font-semibold text-gray-900">
                {quote.user
                  ? `${quote.user.firstName} ${quote.user.lastName}`
                  : "Customer"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Order No:
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {quote.orderId ? (
                  quote.orderId
                ) : (
                  <span className="text-gray-600 italic">
                    Will be generated on approval
                  </span>
                )}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Email:</span>
              <span className="text-sm font-semibold text-gray-900">
                {quote.email}
              </span>
            </div>
            {quote.totalCoins !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  Coin Quantity:
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {quote.totalCoins}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Current Status:
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {quote.status}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="totalPrice"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
            >
              <DollarSign className="h-4 w-4 text-gray-600" />
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
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2a3a] focus:border-transparent transition-all"
              placeholder="Enter total price"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="ternary"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleSubmit}
              disabled={approveMutation.isPending}
              className="px-6 py-2.5 shadow-md hover:shadow-lg transition-shadow flex items-center gap-2"
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
    </div>
  );
};

export default ApproveQuoteModal;
