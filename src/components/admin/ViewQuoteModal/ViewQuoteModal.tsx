"use client";
import React, { useEffect } from "react";
import { useAdminQuoteById } from "@/src/hooks/useQueries";
import { X, FileText, Loader2, AlertCircle } from "lucide-react";

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

interface Quote {
  orderId: string;
  status: string;
  method: string;
  totalCoins: number;
  feedback?: string;
  email: string;
  user?: User;
  packaging: boolean;
  description?: string;
  createdAt: string;
}

interface UseAdminQuoteByIdResult {
  data?: Quote;
  isLoading: boolean;
  isError: boolean;
}

interface ViewQuoteModalProps {
  id: string;
  onClose: () => void;
}

const ViewQuoteModal: React.FC<ViewQuoteModalProps> = ({ id, onClose }) => {
  const {
    data: quote,
    isLoading,
    isError,
  } = useAdminQuoteById(id) as UseAdminQuoteByIdResult;

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
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full relative transform transition-all animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1a2a3a] rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Quote Details</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-[#1a2a3a] mb-4" />
              <p className="text-gray-600 font-medium">
                Loading quote details...
              </p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <p className="text-red-600 font-medium">Failed to load quote</p>
            </div>
          ) : quote ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Order ID
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {quote.orderId ? (
                      quote.orderId
                    ) : (
                      <span className="text-gray-600 italic">Pending</span>
                    )}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Status
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {quote.status}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Method
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {quote.method}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Total Coins
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {quote.totalCoins}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Email
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {quote.user ? quote.user.email : quote.email}
                </p>
              </div>

              {quote.feedback && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Feedback
                  </p>
                  <p className="text-sm text-gray-900 leading-relaxed">
                    {quote.feedback}
                  </p>
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Packaging
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {quote.packaging ? "Yes" : "No"}
                </p>
                {quote.description && (
                  <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                    {quote.description}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs font-medium text-gray-700">
                  Created At:{" "}
                  <span className="text-gray-900">
                    {new Date(quote.createdAt).toLocaleString()}
                  </span>
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ViewQuoteModal;
