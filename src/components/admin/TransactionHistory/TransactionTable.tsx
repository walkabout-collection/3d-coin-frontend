"use client";
import React from "react";
import { PaymentTransaction } from "@/src/services/apiServices";
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
    return `${month} ${day}, ${year} ${hours}:${minutes}`;
  } catch {
    return dateString;
  }
};
import { Eye, Loader2 } from "lucide-react";
import Button from "@/src/components/common/button/Button";

interface TransactionTableProps {
  transactions: PaymentTransaction[];
  loading?: boolean;
  onViewDetails?: (transaction: PaymentTransaction) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  loading,
  onViewDetails,
}) => {
  const getMethodBadge = (method: string) => {
    const colors = {
      QUICKBOOKS: "bg-blue-100 text-blue-800 border-blue-200",
      STRIPE: "bg-purple-100 text-purple-800 border-purple-200",
      MANUAL: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium border ${
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
        className={`px-2 py-1 rounded-full text-xs font-medium border ${
          colors[status as keyof typeof colors] || colors.PENDING
        }`}
      >
        {status}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#1a2a3a] mb-4" />
        <p className="text-gray-600">Loading transactions...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg font-medium mb-2">No transactions found</p>
        <p className="text-sm">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Method
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Transaction ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <tr
              key={transaction.paymentId}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatDate(transaction.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {transaction.customer || "N/A"}
                </div>
                {transaction.customerEmail && (
                  <div className="text-sm text-gray-500">
                    {transaction.customerEmail}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getMethodBadge(transaction.method)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {formatCurrency(transaction.amount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col gap-1">
                  {getStatusBadge(transaction.status)}
                  {transaction.method === "QUICKBOOKS" &&
                    transaction.quickbooksSyncStatus && (
                      <div className="text-xs text-gray-500 mt-1">
                        Sync: {transaction.quickbooksSyncStatus}
                      </div>
                    )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {transaction.transactionId}
                </code>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Button
                  variant="ternary"
                  onClick={() => onViewDetails?.(transaction)}
                  className="!px-3 !py-1 text-xs"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
