"use client";
import React, { useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { dashboardCards } from "./data";
import { DashboardProps } from "./types";
import {
  useGetUserStats,
  useUserOrders,
  useUserOrderHistory,
  useUserDrafts,
} from "@/src/hooks/useQueries";
import Table from "@/src/components/common/Table";
import { TableColumn } from "@/src/components/common/Table/types";
import Button from "@/src/components/common/button/Button";
import { UserOrder } from "@/src/services/apiServices";
import { OrderDataItem } from "../orders/types";

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

export default function Dashboard({ cards = dashboardCards }: DashboardProps) {
  const router = useRouter();
  const { data: stats } = useGetUserStats();

  // Fetch recent orders (limit 10)
  const { data: orderHistoryData, isPending: isHistoryPending } =
    useUserOrderHistory();

  const { data: orderDataResponse, isPending: isOrdersPending } = useUserOrders(
    {
      page: 1,
      limit: 10,
    },
    {
      staleTime: 0,
      queryKey: [],
    },
  );

  const { data: drafts } = useUserDrafts();

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

  // Helper to extract payment status from order
  const getPaymentStatus = (order: UserOrder | OrderDataItem): string => {
    if ("paymentStatus" in order && order.paymentStatus) {
      return order.paymentStatus;
    }
    if (
      "Payment" in order &&
      Array.isArray(order.Payment) &&
      order.Payment.length > 0
    ) {
      const successPayment = order.Payment.find((p) => p.status === "SUCCESS");
      if (successPayment) return "PAID";
      const pendingPayment = order.Payment.find((p) => p.status === "PENDING");
      if (pendingPayment) return "PENDING";
      const failedPayment = order.Payment.find(
        (p) => p.status === "FAILED" || p.status === "REFUNDED",
      );
      if (failedPayment) return "FAILED";
    }
    if (
      "quotes" in order &&
      Array.isArray(order.quotes) &&
      order.quotes.length > 0
    ) {
      const quote = order.quotes[0];
      if (quote.method === "MANUAL" && order.status === "PENDING") {
        return "PENDING";
      }
      if (order.status === "APPROVED") {
        return "PAID";
      }
    }
    if (
      "payments" in order &&
      Array.isArray(order.payments) &&
      order.payments.length > 0
    ) {
      const successPayment = order.payments.find((p) => p.status === "SUCCESS");
      if (successPayment) return "PAID";
      const pendingPayment = order.payments.find((p) => p.status === "PENDING");
      if (pendingPayment) return "PENDING";
      const failedPayment = order.payments.find(
        (p) => p.status === "FAILED" || p.status === "REFUNDED",
      );
      if (failedPayment) return "FAILED";
    }
    return "UNPAID";
  };

  // Helper to extract payment date from order
  const getPaymentDate = (order: UserOrder | OrderDataItem): string | null => {
    if ("paymentDate" in order && order.paymentDate) {
      return order.paymentDate;
    }
    if (
      "Payment" in order &&
      Array.isArray(order.Payment) &&
      order.Payment.length > 0
    ) {
      const payment = order.Payment.find((p) => p.status === "SUCCESS");
      return payment?.paidAt || null;
    }
    if (
      "payments" in order &&
      Array.isArray(order.payments) &&
      order.payments.length > 0
    ) {
      const payment = order.payments.find((p) => p.status === "SUCCESS");
      return payment?.paidAt || null;
    }
    return null;
  };

  interface DisplayDataItem {
    id: string;
    orderId: string;
    status: string;
    totalCoins?: number | null;
    totalPrice: number;
    paymentStatus?: string;
    paymentMethod: string;
    paymentDate?: string | null;
    date: string;
  }

  // Prepare display data for recent orders
  const recentOrdersData: DisplayDataItem[] = useMemo(() => {
    // Try order history first, then fallback to paginated orders
    if (orderHistoryData?.data && Array.isArray(orderHistoryData.data)) {
      return orderHistoryData.data.slice(0, 10).map((item) => {
        // For order history, check if there's a paymentDate field or use paymentId to determine if paid
        // Store raw date string, will be formatted in render function
        const paymentDate =
          item.paymentDate || (item.paymentId ? item.date : null);
        return {
          id: item.orderId,
          orderId: item.orderId,
          paymentMethod: formatPaymentMethod(item.paymentMethod),
          totalPrice: item.total,
          date: formatDate(item.date),
          status: item.status || "APPROVED",
          paymentStatus: item.paymentStatus || "UNPAID",
          paymentDate: paymentDate || null, // Store raw date, format in render
        };
      });
    }

    const orderDataArray = Array.isArray(orderDataResponse)
      ? orderDataResponse
      : orderDataResponse?.data || [];

    return orderDataArray
      .slice(0, 10)
      .map((order: UserOrder | OrderDataItem) => {
        const isUserOrder = "paymentMethod" in order || "Quote" in order;
        let paymentMethod: string;

        if (isUserOrder) {
          const userOrder = order as UserOrder;
          paymentMethod = formatPaymentMethod(
            userOrder.paymentMethod ||
              (Array.isArray(userOrder.Quote) && userOrder.Quote[0]
                ? userOrder.Quote[0].method
                : undefined) ||
              (Array.isArray(userOrder.Payment) && userOrder.Payment[0]
                ? userOrder.Payment[0].method
                : undefined),
          );
        } else {
          paymentMethod = formatPaymentMethod(
            (order as OrderDataItem).quotes?.[0]?.method,
          );
        }

        // Store raw date string, will be formatted in render function
        const paymentDateValue = getPaymentDate(order);
        return {
          id: order.id || order.orderId || "",
          orderId: order.orderId || order.id || "",
          status: order.status || "APPROVED",
          totalCoins: "totalCoins" in order ? order.totalCoins : undefined,
          totalPrice: order.totalPrice || 0,
          paymentStatus: getPaymentStatus(order),
          paymentMethod: paymentMethod,
          paymentDate: paymentDateValue || null, // Store raw date, format in render
          date: formatDate(order.orderDate),
        };
      });
  }, [orderHistoryData, orderDataResponse]);

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
      key: "totalCoins",
      label: "Total Coins",
      width: "w-24",
      render: (value) => (value != null ? String(value) : "N/A"),
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
  ];

  const isOrdersLoading = isHistoryPending || isOrdersPending;

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

      {/* Drafts Section */}
      {drafts && drafts.length > 0 && (
        <div className="mt-8 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Your Drafts
                </h2>
                <p className="text-gray-600">
                  You have {drafts.length} saved draft
                  {drafts.length !== 1 ? "s" : ""}. Continue editing or submit
                  your designs.
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => router.push("/drafts")}
                className="flex items-center gap-2"
              >
                View All Drafts
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Orders Section */}
      <div className="mt-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
        </div>
        {isOrdersLoading ? (
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
