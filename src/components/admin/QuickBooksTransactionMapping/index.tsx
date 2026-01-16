"use client";
import React, { useState, useEffect } from "react";
import {
  useAdminQuickBooksUnmappedTransactions,
  useMapAdminQuickBooksTransaction,
} from "@/src/hooks/useQueries";
import Button from "@/src/components/common/button/Button";
import {
  Link2,
  Search,
  RefreshCw,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";
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

interface MappingModalProps {
  transaction: QuickBooksTransaction;
  orderId: string;
  onOrderIdChange: (value: string) => void;
  onClose: () => void;
  onMap: () => void;
  isPending: boolean;
}

const MappingModal: React.FC<MappingModalProps> = ({
  transaction,
  orderId,
  onOrderIdChange,
  onClose,
  onMap,
  isPending,
}) => {
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
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1a2a3a] rounded-lg flex items-center justify-center">
              <Link2 className="h-5 w-5 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900">
              Map Transaction to Order
            </h4>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
            disabled={isPending}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Link2 className="h-4 w-4 text-gray-600" />
              Transaction ID
            </label>
            <input
              type="text"
              value={transaction.transactionId || transaction.Id || ""}
              disabled
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed opacity-75"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Link2 className="h-4 w-4 text-gray-600" />
              Order ID (UUID)
            </label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => onOrderIdChange(e.target.value)}
              placeholder="Enter order UUID"
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2a3a] focus:border-transparent transition-all"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="ternary"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 transition-colors"
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={onMap}
              disabled={!orderId.trim() || isPending}
              className="px-6 py-2.5 shadow-md hover:shadow-lg transition-shadow flex items-center gap-2"
            >
              {isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Mapping...
                </>
              ) : (
                <>
                  <Link2 className="h-4 w-4" />
                  Map Transaction
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

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

    const transactionId =
      selectedTransaction.transactionId || selectedTransaction.Id;
    if (!transactionId) {
      toast.error(
        "Transaction ID is missing. Please select a valid transaction.",
      );
      return;
    }

    try {
      await mapTransaction.mutateAsync({
        transactionId,
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
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by transaction ID, description, or user email..."
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2a3a] focus:border-transparent transition-all bg-white"
        />
      </div>

      {/* Stats */}
      <div className="mb-4 text-sm font-semibold text-gray-700 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
        Found{" "}
        <span className="text-[#1a2a3a]">
          {unmappedData?.data?.count || transactions.length}
        </span>{" "}
        unmapped transaction{transactions.length !== 1 ? "s" : ""}
      </div>

      {/* Mapping Modal */}
      {isDialogOpen && selectedTransaction && (
        <MappingModal
          transaction={selectedTransaction}
          orderId={orderIdToMap}
          onOrderIdChange={setOrderIdToMap}
          onClose={() => {
            setIsDialogOpen(false);
            setOrderIdToMap("");
            setSelectedTransaction(null);
          }}
          onMap={handleMapTransaction}
          isPending={mapTransaction.isPending}
        />
      )}

      {/* Transactions Table */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-10 w-10 animate-spin text-[#1a2a3a] mb-4" />
          <p className="text-gray-700 font-medium">Loading transactions...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto bg-white border border-red-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Failed to Load Transactions
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Unable to load QuickBooks transactions. Please try again.
                </p>
                <Button
                  variant="primary"
                  onClick={() => refetch()}
                  className="shadow-md hover:shadow-lg transition-shadow"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Link2 className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-700 font-medium">No transactions found</p>
          <p className="text-sm text-gray-600 mt-2">
            {searchTerm
              ? "No transactions match your search criteria."
              : "No unmapped QuickBooks transactions available."}
          </p>
        </div>
      ) : (
        <Table columns={transactionColumns} data={filteredTransactions} />
      )}
    </div>
  );
};

export default QuickBooksTransactionMapping;
