"use client";
import React, { useState, useEffect } from "react";
import {
  useCreateQuickBooksInvoice,
  useQuickBooksInvoiceStatus,
  useQuickBooksConnectionStatus,
} from "@/src/hooks/useQueries";
import { toast } from "react-toastify";
import Button from "../common/button/Button";
import QuickBooksConnectionStatus from "./QuickBooksConnectionStatus";
import QuickBooksOAuthModal from "./QuickBooksOAuthModal";
import { X } from "lucide-react";

interface QuickBooksPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  quoteId: string;
  amount: number;
  orderId?: string;
  onPaymentSuccess?: () => void;
}

const QuickBooksPaymentModal: React.FC<QuickBooksPaymentModalProps> = ({
  isOpen,
  onClose,
  quoteId,
  amount,
  orderId,
  onPaymentSuccess,
}) => {
  const [showOAuthModal, setShowOAuthModal] = useState(false);
  const [createdInvoiceId, setCreatedInvoiceId] = useState<string | null>(null);

  const { data: connectionStatus, refetch: refetchConnection } =
    useQuickBooksConnectionStatus({
      enabled: isOpen,
    });

  const { mutate: createInvoice, isPending: isCreatingInvoice } =
    useCreateQuickBooksInvoice({
      onSuccess: (data) => {
        if (data.success && data.data.invoiceId) {
          setCreatedInvoiceId(data.data.quickbooksInvoiceId);
          toast.success(
            `Invoice created successfully! Invoice #${data.data.invoiceNumber || data.data.quickbooksInvoiceId}`,
          );
        } else {
          toast.error(data.message || "Failed to create invoice");
        }
      },
      onError: (error) => {
        const msg = error instanceof Error ? error.message : String(error);
        toast.error(msg || "Failed to create QuickBooks invoice");
      },
    });

  const { data: invoiceStatus } = useQuickBooksInvoiceStatus(createdInvoiceId);

  const isConnected = connectionStatus?.data?.connected ?? false;

  useEffect(() => {
    if (isOpen && !isConnected) {
      // Auto-open OAuth modal if not connected
      setShowOAuthModal(true);
    }
  }, [isOpen, isConnected]);

  const handleCreateInvoice = () => {
    if (!isConnected) {
      setShowOAuthModal(true);
      return;
    }

    createInvoice({
      quoteId,
      amount,
    });
  };

  const handleOAuthSuccess = () => {
    refetchConnection();
    setShowOAuthModal(false);
  };

  const handleClose = () => {
    if (createdInvoiceId && invoiceStatus?.data?.status === "PAID") {
      // Payment completed, trigger success callback
      if (onPaymentSuccess) {
        onPaymentSuccess();
      }
    }
    setCreatedInvoiceId(null);
    onClose();
  };

  // Handle escape key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !showOAuthModal) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, showOAuthModal]);

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !showOAuthModal) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto transform transition-all animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-xl font-bold text-gray-900">
              QuickBooks Payment
            </h2>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
              disabled={isCreatingInvoice}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">
            {/* Order/Quote Info */}
            <div className="mb-6 space-y-3">
              {orderId && (
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <span className="text-sm font-medium text-gray-700">
                    Order No:
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {orderId}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                <span className="text-sm font-medium text-gray-700">
                  Amount:
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  ${amount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Connection Status */}
            <div className="mb-6">
              <QuickBooksConnectionStatus
                onReconnect={() => setShowOAuthModal(true)}
              />
            </div>

            {/* Invoice Creation */}
            {!createdInvoiceId ? (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    {isConnected
                      ? "Click the button below to create an invoice in QuickBooks. Once created, you can track its payment status here."
                      : "Please connect your QuickBooks account to create invoices."}
                  </p>
                </div>

                <Button
                  variant="primary"
                  onClick={handleCreateInvoice}
                  disabled={!isConnected || isCreatingInvoice}
                  className="w-full"
                >
                  {isCreatingInvoice
                    ? "Creating Invoice..."
                    : "Create Invoice in QuickBooks"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Invoice Status */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-sm text-gray-900 mb-3">
                    Invoice Status
                  </h3>
                  {invoiceStatus?.data ? (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-medium">
                          Invoice ID:
                        </span>
                        <span className="font-semibold text-gray-900">
                          {invoiceStatus.data.quickbooksInvoiceId}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-medium">
                          Status:
                        </span>
                        <span
                          className={`font-medium ${
                            invoiceStatus.data.status === "PAID"
                              ? "text-green-600"
                              : invoiceStatus.data.status === "OVERDUE"
                                ? "text-red-600"
                                : "text-yellow-600"
                          }`}
                        >
                          {invoiceStatus.data.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-medium">
                          Amount:
                        </span>
                        <span className="font-semibold text-gray-900">
                          ${invoiceStatus.data.amount.toFixed(2)}
                        </span>
                      </div>
                      {invoiceStatus.data.amountPaid > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-700 font-medium">
                            Amount Paid:
                          </span>
                          <span className="font-semibold text-green-700">
                            ${invoiceStatus.data.amountPaid.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {invoiceStatus.data.amountDue > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-700 font-medium">
                            Amount Due:
                          </span>
                          <span className="font-semibold text-gray-900">
                            ${invoiceStatus.data.amountDue.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {invoiceStatus.data.dueDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-700 font-medium">
                            Due Date:
                          </span>
                          <span className="font-semibold text-gray-900">
                            {new Date(
                              invoiceStatus.data.dueDate,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {invoiceStatus.data.paidDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-700 font-medium">
                            Paid Date:
                          </span>
                          <span className="font-semibold text-green-700">
                            {new Date(
                              invoiceStatus.data.paidDate,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#1a2a3a]"></div>
                      <span className="text-sm text-gray-700 font-medium">
                        Loading invoice status...
                      </span>
                    </div>
                  )}
                </div>

                {/* Status Messages */}
                {invoiceStatus?.data?.status === "PENDING" && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      Invoice created successfully! Payment status will update
                      automatically when payment is received in QuickBooks.
                    </p>
                  </div>
                )}

                {invoiceStatus?.data?.status === "PAID" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-800 font-medium">
                      ✓ Payment received! This invoice has been paid in
                      QuickBooks.
                    </p>
                  </div>
                )}

                {invoiceStatus?.data?.status === "OVERDUE" && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-800">
                      This invoice is overdue. Please make payment in
                      QuickBooks.
                    </p>
                  </div>
                )}

                <Button
                  variant="primary"
                  onClick={handleClose}
                  className="w-full shadow-md hover:shadow-lg transition-shadow"
                >
                  {invoiceStatus?.data?.status === "PAID"
                    ? "Close"
                    : "Close (Track in QuickBooks)"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* OAuth Modal */}
      <QuickBooksOAuthModal
        isOpen={showOAuthModal}
        onClose={() => setShowOAuthModal(false)}
        onSuccess={handleOAuthSuccess}
      />
    </>
  );
};

export default QuickBooksPaymentModal;
