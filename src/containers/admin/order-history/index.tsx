"use client";
import { useState } from "react";
import { TableColumn } from "@/src/components/common/Table/types";
import { OrderDataItem, OrderResponse, Payment } from "./types";
import AdminTable from "@/src/components/admin/AdminTable";
import { useAdminOrders } from "@/src/hooks/useQueries";

// Format payment method display
const formatPaymentMethod = (method: string | undefined): string => {
  if (!method) return "N/A";
  switch (method.toUpperCase()) {
    case "STRIPE":
      return "STRIPE";
    case "MANUAL":
      return "MANUAL";
    case "QUICKBOOKS":
      return "QUICKBOOKS";
    default:
      return method;
  }
};

const OrdersHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;

  const { data: orders = [], isLoading } = useAdminOrders();

  // Filter out orders that have quotes with designStatus: "DRAFT"
  const filteredOrders = orders.filter((order: OrderResponse) => {
    // If order has quotes, check if any quote has designStatus: "DRAFT"
    if (order.quotes && order.quotes.length > 0) {
      return !order.quotes.some(
        (quote) => quote.designStatus?.toUpperCase() === "DRAFT",
      );
    }
    // If no quotes, include the order
    return true;
  });

  const orderData: OrderDataItem[] = filteredOrders.map(
    (order: OrderResponse & { Payment?: Payment[] }) => {
      // Get payment method from Payment array (capital P - from API), payments (lowercase - from type), or quote method as fallback
      const paymentMethod =
        (order.Payment &&
          Array.isArray(order.Payment) &&
          order.Payment[0]?.method) ||
        (order.payments &&
          Array.isArray(order.payments) &&
          order.payments[0]?.method) ||
        order.quotes?.[0]?.method ||
        undefined;

      return {
        id: order.id,
        trackingNo: order.orderId || "N/A",
        packaging: order.quotes?.[0]?.packaging || "Yes",
        description:
          order.quotes?.[0]?.description || "No description available",
        order: order.totalCoins.toString(),
        date: order.quotes?.[0]?.createdAt || order.orderDate,
        payment: formatPaymentMethod(paymentMethod),
        status: order.status,
        userId: order.userId || "N/A",
        text: order.quotes?.[0]?.coinDesign?.text || "No back text available",
      };
    },
  );

  console.log("Mapped orderData:", orderData);

  const orderColumns: TableColumn<OrderDataItem>[] = [
    { key: "trackingNo", label: "Order No.", width: "w-32" },
    { key: "packaging", label: "Packaging", width: "w-24" },
    { key: "order", label: "Total Coins", width: "w-20" },
    { key: "date", label: "Date", width: "w-32" },
    { key: "payment", label: "Payment Method", width: "w-32" },
    { key: "status", label: "Status", width: "w-28" },
  ];

  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Order History
      </h1>
      {isLoading ? (
        <div>Loading orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div>No orders available</div>
      ) : (
        <AdminTable
          columns={orderColumns}
          data={orderData}
          alternatingRows={true}
          searchable={true}
          searchPlaceholder="Search orders..."
          sortable={true}
          currentSort="newest"
          loading={isLoading}
          pagination={{
            currentPage,
            entriesPerPage,
            totalEntries: orderData.length,
            totalPages: Math.ceil(orderData.length / entriesPerPage),
            onPageChange: (page: number) => setCurrentPage(page),
          }}
        />
      )}
    </div>
  );
};

export default OrdersHistory;
