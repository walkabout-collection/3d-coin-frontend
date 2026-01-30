"use client";
import React from "react";
import { PaymentTransaction } from "@/src/services/apiServices";
import {
  X,
  ExternalLink,
  Calendar,
  DollarSign,
  User,
  FileText,
} from "lucide-react";
// Date formatting helper
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${month} ${day}, ${year} ${hours}:${minutes}:${seconds}`;
  } catch {
    return dateString;
  }
};
import Button from "@/src/components/common/button/Button";

interface TransactionDetailsModalProps {
  transaction: PaymentTransaction;
  onClose: () => void;
}

const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({
  transaction,
  onClose,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getMethodBadge = (method: string) => {
    const colors = {
      QUICKBOOKS: "bg-blue-100 text-blue-800 border-blue-200",
      STRIPE: "bg-purple-100 text-purple-800 border-purple-200",
      MANUAL: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium border ${
          colors[method as keyof typeof colors] || colors.MANUAL
        }`}
      >
        {method}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      SUCCESS: "bg-green-100 text-green-800 border-green-200",
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      FAILED: "bg-red-100 text-red-800 border-red-200",
      REFUNDED: "bg-orange-100 text-orange-800 border-orange-200",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium border ${
          colors[status as keyof typeof colors] || colors.PENDING
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Transaction Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600 flex items-center gap-2 mb-1">
                <FileText className="h-4 w-4" />
                Payment ID
              </label>
              <p className="text-gray-900 font-mono text-sm bg-gray-50 p-2 rounded">
                {transaction.paymentId}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 flex items-center gap-2 mb-1">
                <FileText className="h-4 w-4" />
                Transaction ID
              </label>
              <p className="text-gray-900 font-mono text-sm bg-gray-50 p-2 rounded">
                {transaction.transactionId}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 flex items-center gap-2 mb-1">
                <DollarSign className="h-4 w-4" />
                Amount
              </label>
              <p className="text-gray-900 text-2xl font-bold">
                {formatCurrency(transaction.amount)}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4" />
                Created At
              </label>
              <p className="text-gray-900">
                {formatDate(transaction.createdAt)}
              </p>
              {transaction.paidAt && (
                <p className="text-sm text-gray-500 mt-1">
                  Paid: {formatDate(transaction.paidAt)}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 mb-1">
                Method
              </label>
              <div>{getMethodBadge(transaction.method)}</div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 mb-1">
                Status
              </label>
              <div>{getStatusBadge(transaction.status)}</div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Name
                </label>
                <p className="text-gray-900">{transaction.customer || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Email
                </label>
                <p className="text-gray-900">
                  {transaction.customerEmail || "N/A"}
                </p>
              </div>
              {transaction.userId && (
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    User ID
                  </label>
                  <p className="text-gray-900 font-mono text-sm">
                    {transaction.userId}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order/Quote Info */}
          {(transaction.orderId || transaction.quoteId) && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {transaction.orderId && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Order ID
                    </label>
                    <p className="text-gray-900 font-mono text-sm">
                      {transaction.orderId}
                    </p>
                  </div>
                )}
                {transaction.quoteId && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Quote ID
                    </label>
                    <p className="text-gray-900 font-mono text-sm">
                      {transaction.quoteId}
                    </p>
                  </div>
                )}
                {transaction.orderTotal && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Order Total
                    </label>
                    <p className="text-gray-900 font-semibold">
                      {formatCurrency(transaction.orderTotal)}
                    </p>
                  </div>
                )}
                {transaction.totalCoins && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Total Coins
                    </label>
                    <p className="text-gray-900">{transaction.totalCoins}</p>
                  </div>
                )}
                {transaction.coinDesignName && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-600">
                      Design Name
                    </label>
                    <p className="text-gray-900">
                      {transaction.coinDesignName}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Method-Specific Details */}
          {transaction.method === "QUICKBOOKS" && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                QuickBooks Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {transaction.quickbooksInvoiceId && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Invoice ID
                    </label>
                    <p className="text-gray-900 font-mono text-sm">
                      {transaction.quickbooksInvoiceId}
                    </p>
                  </div>
                )}
                {transaction.quickbooksSyncStatus && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Sync Status
                    </label>
                    <p className="text-gray-900">
                      {transaction.quickbooksSyncStatus}
                    </p>
                  </div>
                )}
                {transaction.quickbooksLastSyncAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Last Sync
                    </label>
                    <p className="text-gray-900">
                      {formatDate(transaction.quickbooksLastSyncAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {transaction.method === "STRIPE" && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Stripe Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {transaction.stripeCheckoutSessionId && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Checkout Session ID
                    </label>
                    <p className="text-gray-900 font-mono text-sm">
                      {transaction.stripeCheckoutSessionId}
                    </p>
                  </div>
                )}
                {transaction.stripeCustomerId && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Customer ID
                    </label>
                    <p className="text-gray-900 font-mono text-sm">
                      {transaction.stripeCustomerId}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {transaction.method === "MANUAL" && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Manual Payment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {transaction.paymentProof && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Payment Proof
                    </label>
                    <a
                      href={transaction.paymentProof}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      View Proof <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                )}
                {transaction.receiptUrl && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Receipt
                    </label>
                    <a
                      href={transaction.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      View Receipt <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
          <Button variant="primary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsModal;
