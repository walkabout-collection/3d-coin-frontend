"use client";
import { useState } from "react";
import { TableColumn } from "@/src/components/common/Table/types";
import { OrderDataItem } from "./types";
import AdminTable from "@/src/components/admin/AdminTable";
import { useAdminOrders } from "@/src/hooks/useQueries";
import { OrderResponse } from "./types";

const OrdersHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;

  const { data: orders = [], isLoading } = useAdminOrders();

  const orderData: OrderDataItem[] = orders.map((order: OrderResponse) => ({
    id: order.id,
    trackingNo: order.orderId || "N/A",
    packaging: order.quotes?.[0]?.packaging || "Yes",
    description: order.quotes?.[0]?.description || "No description available",
    order: order.totalCoins.toString(),
    date: order.quotes?.[0]?.createdAt || order.orderDate,
    payment: order.quotes?.[0]?.method || "N/A",
    status: order.status,
    userId: order.userId || "N/A",
    text: order.quotes?.[0]?.coinDesign?.text || "No back text available",
  }));

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
      ) : orders.length === 0 ? (
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
