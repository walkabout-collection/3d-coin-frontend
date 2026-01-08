"use client";
import React, { useState } from "react";
import { useQuickBooksTransactions } from "@/src/hooks/useQueries";

// Format date as DD/MM/YYYY
const formatDate = (dateString: string | number | undefined): string => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return "Invalid date";
  }
};

interface QuickBooksTransactionsProps {
  limit?: number;
}

const QuickBooksTransactions: React.FC<QuickBooksTransactionsProps> = ({
  limit = 10,
}) => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = limit;

  const {
    data: transactionsData,
    isLoading,
    error,
    refetch,
  } = useQuickBooksTransactions(
    {
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    },
    {
      enabled: true,
    },
  );

  const transactions = transactionsData?.data?.transactions || [];
  const total = transactionsData?.data?.total || 0;
  const hasMore = transactionsData?.data?.hasMore || false;

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getTypeBadgeColor = (type: string): string => {
    switch (type.toUpperCase()) {
      case "INVOICE":
        return "bg-blue-100 text-blue-800";
      case "PAYMENT":
        return "bg-green-100 text-green-800";
      case "EXPENSE":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadgeColor = (status: string): string => {
    switch (status.toUpperCase()) {
      case "PAID":
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "OVERDUE":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading transactions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 text-sm">
          Failed to load QuickBooks transactions. Please try again.
        </p>
        <button
          onClick={() => refetch()}
          className="mt-2 text-sm text-red-600 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="quickbooks-transactions">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          QuickBooks Transactions
        </h3>
        {total > 0 && (
          <p className="text-sm text-gray-600">
            Total: {total} transaction{total !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Date Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-800"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-800"
          />
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-sm">
            No transactions found for the selected period.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700">
                    Description
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700">
                    Customer
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4 text-xs text-gray-700">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-900">
                      {transaction.description || "N/A"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(transaction.type)}`}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-700">
                      {transaction.customerName || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-900 font-medium text-right">
                      {formatAmount(transaction.amount)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(transaction.status)}`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {total > pageSize && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-gray-600">
                Showing {(currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, total)} of {total}{" "}
                transactions
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-xs border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={!hasMore}
                  className="px-3 py-1 text-xs border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuickBooksTransactions;
