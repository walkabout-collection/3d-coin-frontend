"use client";
import React, { useState } from "react";
import {
  useAdminQuickBooksUnmappedTransactions,
  useMapAdminQuickBooksTransaction,
} from "@/src/hooks/useQueries";
import Button from "@/src/components/common/button/Button";
import { Link2, Search, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import Table from "@/src/components/common/Table";
import { TableColumn } from "@/src/components/common/Table/types";

interface QuickBooksTransaction {
  transactionId?: string;
  Id?: string;
  userName?: string;
  userEmail?: string;
  invoiceId?: string | null;
  TotalAmt?: string | number;
  Amount?: string | number;
  TxnDate?: string;
  date?: string;
  [key: string]: unknown;
}

const QuickBooksTransactionMapping: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransaction, setSelectedTransaction] =
    useState<QuickBooksTransaction | null>(null);
  const [orderIdToMap, setOrderIdToMap] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    data: unmappedData,
    isLoading,
    isError,
    refetch,
  } = useAdminQuickBooksUnmappedTransactions();

  const mapTransaction = useMapAdminQuickBooksTransaction({
    onSuccess: () => {
      toast.success("Transaction mapped successfully");
      setIsDialogOpen(false);
      setOrderIdToMap("");
      setSelectedTransaction(null);
      refetch();
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to map transaction";
      toast.error(errorMessage);
    },
  });

  const handleMapTransaction = async () => {
    if (!selectedTransaction || !orderIdToMap.trim()) {
      toast.error("Please select a transaction and enter an order ID");
      return;
    }

    try {
      await mapTransaction.mutateAsync({
        transactionId:
          selectedTransaction.transactionId || selectedTransaction.Id,
        orderId: orderIdToMap.trim(),
      });
    } catch {
      // Error handled by mutation
    }
  };

  const openMapDialog = (transaction: QuickBooksTransaction) => {
    setSelectedTransaction(transaction);
    setIsDialogOpen(true);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const transactions =
    (unmappedData?.data?.transactions as QuickBooksTransaction[]) || [];
  const filteredTransactions = searchTerm
    ? transactions.filter(
        (t: QuickBooksTransaction) =>
          (t.transactionId || t.Id || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (t.userEmail || "").toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : transactions;

  const transactionColumns: TableColumn<QuickBooksTransaction>[] = [
    {
      key: "userName",
      label: "User",
      width: "w-40",
      render: (_value, row) => (
        <div>
          <div className="font-medium">{row.userName}</div>
          <div className="text-sm text-gray-500">{row.userEmail}</div>
        </div>
      ),
    },
    {
      key: "transactionId",
      label: "Transaction ID",
      width: "w-32",
      render: (_value, row) => (
        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
          {row.transactionId || row.Id}
        </code>
      ),
    },
    {
      key: "invoiceId",
      label: "Invoice ID",
      width: "w-32",
      render: (_value, row) =>
        row.invoiceId ? (
          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
            {row.invoiceId}
          </code>
        ) : (
          <span className="text-gray-400">N/A</span>
        ),
    },
    {
      key: "amount",
      label: "Amount",
      width: "w-24",
      render: (_value, row) => {
        const amount =
          typeof row.TotalAmt === "number"
            ? row.TotalAmt
            : typeof row.TotalAmt === "string"
              ? parseFloat(row.TotalAmt)
              : typeof row.Amount === "number"
                ? row.Amount
                : typeof row.Amount === "string"
                  ? parseFloat(row.Amount)
                  : 0;
        return `$${amount.toFixed(2)}`;
      },
    },
    {
      key: "date",
      label: "Date",
      width: "w-28",
      render: (_value, row) =>
        row.TxnDate
          ? formatDate(row.TxnDate)
          : row.date
            ? formatDate(row.date)
            : "N/A",
    },
    {
      key: "actions",
      label: "Actions",
      width: "w-32",
      render: (_value, row) => (
        <Button
          variant="ternary"
          onClick={() => openMapDialog(row)}
          className="text-xs !px-2 !py-1"
        >
          <Link2 className="h-3 w-3 mr-1" />
          Map to Order
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Unmapped QuickBooks Transactions
        </h3>
        <Button
          variant="ternary"
          onClick={() => refetch()}
          className="text-sm !px-3 !py-2"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by transaction ID, description, or user email..."
          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Stats */}
      <div className="mb-4 text-sm text-gray-600">
        Found {unmappedData?.data?.count || transactions.length} unmapped
        transaction(s)
      </div>

      {/* Mapping Modal */}
      {isDialogOpen && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h4 className="text-lg font-semibold mb-4">
              Map Transaction to Order
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction ID
                </label>
                <input
                  type="text"
                  value={
                    selectedTransaction.transactionId ||
                    selectedTransaction.Id ||
                    ""
                  }
                  disabled
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order ID (UUID)
                </label>
                <input
                  type="text"
                  value={orderIdToMap}
                  onChange={(e) => setOrderIdToMap(e.target.value)}
                  placeholder="Enter order UUID"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="ternary"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleMapTransaction}
                  disabled={!orderIdToMap.trim() || mapTransaction.isPending}
                  className="!px-4 !py-2"
                >
                  {mapTransaction.isPending ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      Mapping...
                    </>
                  ) : (
                    "Map Transaction"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading transactions...</span>
        </div>
      ) : isError ? (
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Failed to load transactions</p>
          <Button
            variant="primary"
            onClick={() => refetch()}
            className="text-sm"
          >
            Retry
          </Button>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No transactions found</p>
        </div>
      ) : (
        <Table
          columns={transactionColumns}
          data={filteredTransactions}
          alternatingRows={true}
        />
      )}
    </div>
  );
};

export default QuickBooksTransactionMapping;
