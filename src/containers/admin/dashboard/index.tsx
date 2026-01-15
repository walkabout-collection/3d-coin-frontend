"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { dashboardCards } from "./data";
import { DashboardProps } from "./types";
import { useGetAdminStats, useAdminOrderHistory } from "@/src/hooks/useQueries";
import Table from "@/src/components/common/Table";
import { TableColumn } from "@/src/components/common/Table/types";

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

// Format date as DD/MM/YYYY
const formatDate = (dateString: string | undefined): string => {
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

export default function AdminDashboard({
  cards = dashboardCards,
}: DashboardProps) {
  const { data: stats } = useGetAdminStats();

  // Fetch recent orders (limit 10)
  const { data: orderHistoryData, isPending: isOrdersPending } =
    useAdminOrderHistory();

  const getCardValue = (title: string) => {
    switch (title) {
      case "Lifetime Orders":
        return stats?.totalOrders || 0;
      case "Pending Quotes":
        return stats?.pendingQuotes || 0;
      case "Approve Quotes":
        return stats?.approvedQuotes || 0;
      case "Payment":
        return stats?.totalPayments || 0;
      default:
        return 0;
    }
  };

  interface DisplayDataItem {
    id: string;
    orderId: string;
    status: string;
    totalPrice: number;
    paymentStatus?: string;
    paymentMethod: string;
    paymentDate?: string | null;
    date: string;
    customer?: string;
    customerEmail?: string;
  }

  // Prepare display data for recent orders
  const recentOrdersData: DisplayDataItem[] = useMemo(() => {
    // Extract the actual array from nested structure: data.data
    const historyArray =
      orderHistoryData?.data?.data && Array.isArray(orderHistoryData.data.data)
        ? orderHistoryData.data.data
        : Array.isArray(orderHistoryData?.data)
          ? orderHistoryData.data
          : [];

    return historyArray.slice(0, 10).map((item) => ({
      id: item.orderId,
      orderId: item.orderId,
      paymentMethod: formatPaymentMethod(item.paymentMethod),
      totalPrice: item.total,
      date: formatDate(item.date),
      status: item.status || "APPROVED",
      paymentStatus: item.paymentStatus || "UNPAID",
      paymentDate: item.paymentId ? formatDate(item.date) : null,
      customer: item.customer,
      customerEmail: item.customerEmail,
    }));
  }, [orderHistoryData]);

  const formatPaymentStatus = (status: string | undefined): string => {
    if (!status) return "N/A";
    return status.toUpperCase();
  };

  const formatOrderStatus = (status: string | undefined): string => {
    if (!status) return "N/A";
    return status;
  };

  const orderColumns: TableColumn<DisplayDataItem>[] = [
    {
      key: "orderId",
      label: "Order ID",
      width: "w-40",
    },
    {
      key: "status",
      label: "Order Status",
      width: "w-32",
      render: (value) => formatOrderStatus(value as string),
    },
    {
      key: "paymentStatus",
      label: "Payment Status",
      width: "w-32",
      render: (value) => formatPaymentStatus(value as string),
    },
    {
      key: "totalPrice",
      label: "Order Total",
      width: "w-28",
      render: (value) =>
        value != null ? `$${Number(value).toFixed(2)}` : "N/A",
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
      render: (value) => (value ? formatDate(value as string) : "N/A"),
    },
    {
      key: "date",
      label: "Order Date",
      width: "w-32",
    },
    {
      key: "customer",
      label: "Customer",
      width: "w-40",
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Welcome!</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <div
            key={card.id}
            className="bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#1a2a3a] rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                <div className="w-6 h-6 relative">
                  <Image
                    src={card.icon}
                    alt={`${card.title} icon`}
                    fill
                    className="object-contain filter brightness-0 invert"
                  />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  {card.title}
                </h2>
                <p className="text-2xl font-bold text-gray-900">
                  {getCardValue(card.title)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Section */}
      <div className="mt-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
        </div>
        {isOrdersPending ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading orders...</p>
          </div>
        ) : recentOrdersData.length > 0 ? (
          <Table
            columns={orderColumns}
            data={recentOrdersData}
            currentPage={1}
            totalPages={1}
            entriesPerPage={10}
            totalEntries={recentOrdersData.length}
            hasNextPage={false}
            hasPreviousPage={false}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
