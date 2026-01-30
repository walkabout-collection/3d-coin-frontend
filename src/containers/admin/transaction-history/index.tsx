"use client";
import React, { useState } from "react";
import { useAdminPaymentTransactions } from "@/src/hooks/useQueries";
import {
  TransactionFilters,
  PaymentTransaction,
} from "@/src/services/apiServices";
import TransactionTable from "@/src/components/admin/TransactionHistory/TransactionTable";
import TransactionFiltersComponent from "@/src/components/admin/TransactionHistory/TransactionFilters";
import TransactionDetailsModal from "@/src/components/admin/TransactionHistory/TransactionDetailsModal";
import { Download, RefreshCw, AlertCircle } from "lucide-react";
import Button from "@/src/components/common/button/Button";
// Date formatting helper for CSV export
const formatDateForCSV = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } catch {
    return dateString;
  }
};

const AdminTransactionHistory: React.FC = () => {
  const [filters, setFilters] = useState<TransactionFilters>({
    page: 1,
    limit: 50,
  });
  const [selectedTransaction, setSelectedTransaction] =
    useState<PaymentTransaction | null>(null);

  const {
    data: transactionsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminPaymentTransactions(filters);

  const transactions = transactionsData?.data?.transactions || [];
  const pagination = transactionsData?.data?.pagination;
  const summary = transactionsData?.data?.summary;

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  const handleViewDetails = (transaction: PaymentTransaction) => {
    setSelectedTransaction(transaction);
  };

  const handleCloseModal = () => {
    setSelectedTransaction(null);
  };

  const exportToCSV = () => {
    if (transactions.length === 0) {
      alert("No transactions to export");
      return;
    }

    const headers = [
      "Date",
      "Customer",
      "Email",
      "Method",
      "Amount",
      "Status",
      "Transaction ID",
      "Payment ID",
      "Order ID",
      "Quote ID",
    ];

    const rows = transactions.map((t) => [
      formatDateForCSV(t.createdAt),
      t.customer || "",
      t.customerEmail || "",
      t.method,
      t.amount.toString(),
      t.status,
      t.transactionId,
      t.paymentId,
      t.orderId || "",
      t.quoteId || "",
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  Failed to Load Transactions
                </h3>
                <p className="text-red-800 mb-4">
                  {error instanceof Error
                    ? error.message
                    : "An error occurred while loading transactions"}
                </p>
                <Button variant="primary" onClick={() => refetch()}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Transaction History
              </h1>
              <p className="text-gray-600 mt-2">
                View all payment transactions across QuickBooks, Stripe, and
                Manual methods
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="ternary"
                onClick={() => refetch()}
                disabled={isLoading}
                className="!px-4 !py-2"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button
                variant="primary"
                onClick={exportToCSV}
                disabled={transactions.length === 0 || isLoading}
                className="!px-4 !py-2"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-sm font-medium text-gray-600 mb-1">
                Total Transactions
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {summary.totalTransactions}
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-sm font-medium text-gray-600 mb-1">
                QuickBooks
              </div>
              <div className="text-3xl font-bold text-blue-600">
                {summary.byMethod.QUICKBOOKS}
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-sm font-medium text-gray-600 mb-1">
                Stripe
              </div>
              <div className="text-3xl font-bold text-purple-600">
                {summary.byMethod.STRIPE}
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-sm font-medium text-gray-600 mb-1">
                Manual
              </div>
              <div className="text-3xl font-bold text-gray-600">
                {summary.byMethod.MANUAL}
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <TransactionFiltersComponent
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <TransactionTable
            transactions={transactions}
            loading={isLoading}
            onViewDetails={handleViewDetails}
          />
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="text-sm text-gray-700">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} transactions
            </div>
            <div className="flex gap-2">
              <Button
                variant="ternary"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.hasPreviousPage || isLoading}
                className="!px-4 !py-2"
              >
                Previous
              </Button>
              <div className="flex items-center px-4">
                <span className="text-sm text-gray-700">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
              </div>
              <Button
                variant="ternary"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.hasNextPage || isLoading}
                className="!px-4 !py-2"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Transaction Details Modal */}
        {selectedTransaction && (
          <TransactionDetailsModal
            transaction={selectedTransaction}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
};

export default AdminTransactionHistory;
