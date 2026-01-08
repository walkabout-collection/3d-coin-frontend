"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Table from "@/src/components/common/Table";
import { TableColumn } from "@/src/components/common/Table/types";
import { OrderDataItem } from "./types";
import PayNowModal from "@/src/components/PayNowModal";
import QuickBooksPaymentModal from "@/src/components/QuickBooks/QuickBooksPaymentModal";
import OrderStatus from "@/src/components/OrderStatus";
import Button from "@/src/components/common/button/Button";
import {
  useCreateUserPayment,
  useUserOrders,
  useUserOrderHistory,
} from "@/src/hooks/useQueries";
import { PaymentStatus, GetUserOrdersParams } from "@/src/services/apiServices";
import { toast } from "react-toastify";
import { Loader2, RefreshCw, Receipt, CreditCard } from "lucide-react";

// Format payment method display
const formatPaymentMethod = (method: string | undefined): string => {
  if (!method) return "N/A";
  switch (method.toUpperCase()) {
    case "STRIPE":
      return "CREDIT CARD";
    case "MANUAL":
      return "MANUAL";
    case "QUICKBOOKS":
      return "QUICKBOOKS";
    default:
      return method;
  }
};

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

const Orders = () => {
  const router = useRouter();

  // Filter and sort state
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<
    PaymentStatus | "ALL"
  >("ALL");
  const [sortBy, setSortBy] = useState<
    "date" | "amount" | "paymentStatus" | "paymentDate"
  >("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const limit = 20;

  // Build params for API
  const orderParams: GetUserOrdersParams | undefined =
    paymentStatusFilter !== "ALL"
      ? {
          paymentStatus: paymentStatusFilter,
          sortBy,
          sortOrder,
          page,
          limit,
        }
      : {
          sortBy,
          sortOrder,
          page,
          limit,
        };

  // Use enhanced orders API with params
  const {
    data: ordersData,
    isLoading,
    isError,
    error,
    refetch,
  } = useUserOrders(orderParams);

  // Fallback to old API if needed
  const {
    data: orderHistoryData,
    isPending: isHistoryPending,
    isError: isHistoryError,
  } = useUserOrderHistory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuickBooksModalOpen, setIsQuickBooksModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDataItem | null>(
    null,
  );

  const { mutate: createUserPayment } = useCreateUserPayment({
    onSuccess: () => {
      toast.success("Payment created successfully");
      setIsModalOpen(false);
      refetch(); // Refresh orders after payment
    },
    onError: (error) => {
      console.error("Error creating payment:", error);
      toast.error("Payment creation failed");
    },
  });

  // Transform orders data for display
  interface DisplayDataItem {
    orderId: string;
    paymentMethod: string;
    total: number;
    date: string;
    paymentDate?: string;
    status: string;
    paymentStatus?: PaymentStatus;
    originalOrder?: OrderDataItem;
    quoteId?: string;
  }

  const displayData: DisplayDataItem[] = ordersData?.data
    ? ordersData.data.map(
        (order): DisplayDataItem => ({
          orderId: order.orderId,
          paymentMethod: formatPaymentMethod(order.paymentMethod),
          total: order.totalPrice,
          date: formatDate(order.orderDate),
          paymentDate: order.paymentDate
            ? formatDate(order.paymentDate)
            : undefined,
          status: order.status,
          paymentStatus: order.paymentStatus,
          quoteId: order.Quote?.id,
        }),
      )
    : orderHistoryData?.data
      ? orderHistoryData.data.map(
          (item): DisplayDataItem => ({
            orderId: item.orderId,
            paymentMethod: formatPaymentMethod(item.paymentMethod),
            total: item.total,
            date: formatDate(item.date),
            status: item.status || "APPROVED",
          }),
        )
      : [];

  const isDataPending = ordersData ? isLoading : isHistoryPending;
  const isDataError = ordersData ? isError : isHistoryError;

  const handleConfirmPayment = async (order: unknown) => {
    const originalOrder =
      order && typeof order === "object" && "originalOrder" in (order as object)
        ? (order as Record<string, unknown>)["originalOrder"]
        : order;

    if (!originalOrder || typeof originalOrder !== "object") {
      console.error("Invalid order object");
      return;
    }

    const orig = originalOrder as Record<string, unknown>;
    const maybeQuotes = orig["quotes"];
    if (!Array.isArray(maybeQuotes) || maybeQuotes.length === 0) {
      console.error("No quotes found for this order.");
      return;
    }

    const firstQuote = maybeQuotes[0] as Record<string, unknown>;
    const method =
      typeof firstQuote["method"] === "string"
        ? (firstQuote["method"] as string)
        : undefined;
    const quoteId =
      typeof firstQuote["id"] === "string"
        ? (firstQuote["id"] as string)
        : String(firstQuote["id"]);
    const totalPrice =
      typeof orig["totalPrice"] === "number"
        ? (orig["totalPrice"] as number)
        : undefined;

    if (totalPrice == null || !method) {
      console.error("Missing payment details in quote.");
      return;
    }

    createUserPayment({
      quoteId,
      amount: totalPrice,
      method,
    });
  };

  const handlePayNowClick = (row: DisplayDataItem) => {
    if (row.quoteId) {
      router.push(`/payment?quoteId=${row.quoteId}`);
      return;
    }

    // Fallback to modal for manual/quickbooks
    const originalOrder = row.originalOrder;
    if (originalOrder && "quotes" in originalOrder) {
      setSelectedOrder(originalOrder);
      const paymentMethod = originalOrder.quotes?.[0]?.method?.toUpperCase();
      if (paymentMethod === "QUICKBOOKS") {
        setIsQuickBooksModalOpen(true);
      } else {
        setIsModalOpen(true);
      }
    }
  };

  const handleViewReceipt = (orderId: string) => {
    router.push(`/dashboard/orders/${orderId}/receipt`);
  };

  const handleRetryPayment = (row: DisplayDataItem) => {
    handlePayNowClick(row);
  };

  // Define columns
  const orderColumns: TableColumn<DisplayDataItem>[] = [
    {
      key: "orderId",
      label: "Order ID",
      width: "w-42",
    },
    {
      key: "date",
      label: "Order Date",
      width: "w-32",
    },
    {
      key: "total",
      label: "Amount",
      width: "w-24",
      render: (value) =>
        value != null ? `$${Number(value).toFixed(2)}` : "N/A",
    },
    {
      key: "paymentStatus",
      label: "Payment Status",
      width: "w-32",
      render: (_value, row) => {
        if (row.paymentStatus) {
          return (
            <OrderStatus
              status={row.paymentStatus}
              compact={true}
              showLabel={true}
            />
          );
        }
        // Fallback: try to get from orderId if available
        return <OrderStatus orderId={row.orderId || null} compact={true} />;
      },
    },
    {
      key: "paymentMethod",
      label: "Payment Method",
      width: "w-32",
    },
    {
      key: "paymentDate",
      label: "Payment Date",
      width: "w-32",
      render: (value) => (value ? value : "N/A"),
    },
  ];

  const actions: {
    label: string;
    onClick?: (row: DisplayDataItem) => void;
    variant?: "primary" | "secondary" | "danger" | "success";
    show?: (row: DisplayDataItem) => boolean;
  }[] = [
    {
      label: "Pay Now",
      onClick: handlePayNowClick,
      variant: "primary",
      show: (row: DisplayDataItem) => {
        return row.paymentStatus === "UNPAID" || row.paymentStatus === "FAILED";
      },
    },
    {
      label: "View Receipt",
      onClick: (row) => handleViewReceipt(row.orderId),
      variant: "secondary",
      show: (row: DisplayDataItem) => {
        return row.paymentStatus === "PAID";
      },
    },
    {
      label: "Retry Payment",
      onClick: handleRetryPayment,
      variant: "primary",
      show: (row: DisplayDataItem) => {
        return row.paymentStatus === "FAILED";
      },
    },
  ];

  if (isDataPending && !displayData.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (isDataError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Error Loading Orders
              </h3>
              <p className="text-sm text-red-700 mb-4">
                {error instanceof Error
                  ? error.message
                  : "Failed to load orders. Please try again."}
              </p>
              <Button
                variant="primary"
                onClick={() => refetch()}
                className="text-sm px-4 py-2"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const pagination = ordersData?.pagination;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order History
            </h1>
            <p className="text-gray-600">
              View and manage your orders with payment status
            </p>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Payment Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Status
              </label>
              <select
                value={paymentStatusFilter}
                onChange={(e) => {
                  setPaymentStatusFilter(
                    e.target.value as PaymentStatus | "ALL",
                  );
                  setPage(1); // Reset to first page on filter change
                }}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="PAID">Paid</option>
                <option value="UNPAID">Unpaid</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(
                    e.target.value as
                      | "date"
                      | "amount"
                      | "paymentStatus"
                      | "paymentDate",
                  );
                  setPage(1);
                }}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Order Date</option>
                <option value="amount">Amount</option>
                <option value="paymentStatus">Payment Status</option>
                <option value="paymentDate">Payment Date</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort Order
              </label>
              <select
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value as "asc" | "desc");
                  setPage(1);
                }}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>

            {/* Refresh Button */}
            <div className="flex items-end">
              <Button
                variant="ternary"
                onClick={() => refetch()}
                className="w-full flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Orders {pagination ? `(${pagination.total})` : ""}
            </h2>
          </div>
          {displayData.length > 0 ? (
            <>
              <Table
                columns={orderColumns}
                data={displayData}
                alternatingRows={true}
                searchable={true}
                searchPlaceholder="Search orders..."
                showActions={true}
                actions={actions}
              />

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="p-6 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total,
                    )}{" "}
                    of {pagination.total} orders
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ternary"
                      onClick={() => setPage(page - 1)}
                      disabled={!pagination.hasPreviousPage}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="ternary"
                      onClick={() => setPage(page + 1)}
                      disabled={!pagination.hasNextPage}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">
                No orders found
                {paymentStatusFilter !== "ALL" &&
                  ` with status: ${paymentStatusFilter}`}
              </p>
            </div>
          )}
        </div>

        {/* Payment Modals */}
        {selectedOrder && (
          <>
            <PayNowModal
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                setSelectedOrder(null);
              }}
              order={selectedOrder}
              price={selectedOrder.totalPrice || 0}
              onConfirmPayment={handleConfirmPayment}
              onPaymentSuccess={() => {
                setIsModalOpen(false);
                setSelectedOrder(null);
                refetch();
              }}
            />
            <QuickBooksPaymentModal
              isOpen={isQuickBooksModalOpen}
              onClose={() => {
                setIsQuickBooksModalOpen(false);
                setSelectedOrder(null);
              }}
              quoteId={selectedOrder.quotes?.[0]?.id || ""}
              amount={selectedOrder.totalPrice || 0}
              orderId={selectedOrder.orderId}
              onPaymentSuccess={() => {
                setIsQuickBooksModalOpen(false);
                setSelectedOrder(null);
                refetch();
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Orders;
