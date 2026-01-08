"use client";
import React, { useState } from "react";
import Table from "@/src/components/common/Table";
import { TableColumn } from "@/src/components/common/Table/types";
import { OrderDataItem } from "./types";
import PayNowModal from "@/src/components/PayNowModal";
import {
  useCreateUserPayment,
  useUserOrders,
  useUserOrderHistory,
} from "@/src/hooks/useQueries";
import { toast } from "react-toastify";

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
  // Try to use the new order history API, fallback to old one
  const {
    data: orderHistoryData,
    isPending: isHistoryPending,
    isError: isHistoryError,
  } = useUserOrderHistory();
  const { data: orderData, isPending, isError } = useUserOrders();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDataItem | null>(
    null,
  );
  const { mutate: createUserPayment, isPending: isCreatingPayment } =
    useCreateUserPayment({
      onSuccess: () => {
        toast.success("Payment created successfully");
        setIsModalOpen(false);
      },
      onError: (error) => {
        console.error("Error creating payment:", error);
        toast.error("Payment creation failed");
      },
    });

  // Use order history data if available, otherwise transform order data
  interface DisplayDataItem {
    orderId: string;
    paymentMethod: string;
    total: number;
    date: string;
    status: string;
    originalOrder?: OrderDataItem;
  }

  const displayData: DisplayDataItem[] = orderHistoryData?.data
    ? orderHistoryData.data.map(
        (item): DisplayDataItem => ({
          orderId: item.orderId,
          paymentMethod: formatPaymentMethod(item.paymentMethod),
          total: item.total,
          date: formatDate(item.date),
          status: item.status || "APPROVED",
        }),
      )
    : (orderData || []).map(
        (order: OrderDataItem): DisplayDataItem => ({
          orderId: order.orderId,
          paymentMethod: formatPaymentMethod(order.quotes?.[0]?.method),
          total: order.totalPrice || 0,
          date: formatDate(order.orderDate),
          status: order.status,
          // Keep original order for actions
          originalOrder: order,
        }),
      );

  const isDataPending = orderHistoryData ? isHistoryPending : isPending;
  const isDataError = orderHistoryData ? isHistoryError : isError;

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

    console.log({ quoteId, method, totalPrice });

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
    const originalOrder = row.originalOrder;
    if (originalOrder && "quotes" in originalOrder) {
      setSelectedOrder(originalOrder);
      setIsModalOpen(true);
    }
  };

  // Define columns according to guide format
  const orderColumns: TableColumn<DisplayDataItem>[] = [
    {
      key: "paymentMethod",
      label: "Payment Method",
      width: "w-32",
    },
    {
      key: "total",
      label: "Order Total",
      width: "w-24",
      render: (value) =>
        value != null ? `$${Number(value).toFixed(2)}` : "N/A",
    },
    {
      key: "date",
      label: "Date",
      width: "w-32",
    },
    {
      key: "orderId",
      label: "Order ID",
      width: "w-42",
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
        const originalOrder = row.originalOrder;
        return (
          originalOrder?.status === "PENDING" &&
          originalOrder?.quotes?.[0]?.method === "MANUAL"
        );
      },
    },
    {
      label: "Paid",
      variant: "success",
      show: (row: DisplayDataItem) => {
        const originalOrder = row.originalOrder;
        return (
          originalOrder?.status === "APPROVED" &&
          originalOrder?.quotes?.[0]?.method === "MANUAL"
        );
      },
    },
  ];

  if (isDataPending) return <div>Loading...</div>;
  if (isDataError) return <div>Error loading orders</div>;

  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Order History
      </h1>
      {displayData.length > 0 ? (
        <Table
          columns={orderColumns}
          data={displayData}
          alternatingRows={true}
          searchable={true}
          searchPlaceholder="Search orders..."
          sortable={true}
          currentSort="newest"
          showActions={orderHistoryData ? false : true}
          actions={orderHistoryData ? [] : actions}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No orders found</p>
        </div>
      )}
      {selectedOrder && (
        <PayNowModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          order={selectedOrder}
          price={selectedOrder.totalPrice || 0}
          onConfirmPayment={handleConfirmPayment}
        />
      )}
    </div>
  );
};

export default Orders;
