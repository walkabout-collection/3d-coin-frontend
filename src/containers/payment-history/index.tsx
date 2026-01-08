"use client";
import React, { useState } from "react";
import Table from "@/src/components/common/Table";
import { TableColumn } from "@/src/components/common/Table/types";
import { useUserOrderHistory } from "@/src/hooks/useQueries";
import {
  usePaymentReceipt,
  useGeneratePaymentReceipt,
  useEmailPaymentReceipt,
} from "@/src/hooks/useQueries";
import { usePaymentStatusWebSocket } from "@/src/hooks/usePaymentStatusWebSocket";
import Button from "@/src/components/common/button/Button";
import { toast } from "react-toastify";

interface PaymentHistoryItem {
  orderId: string;
  paymentMethod: string;
  total: number;
  date: string;
  status?: string;
  paymentId?: string;
}

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

interface ReceiptButtonProps {
  paymentId: string;
  paymentStatus?: string;
  variant?: "download" | "email" | "both";
}

const ReceiptButton: React.FC<ReceiptButtonProps> = ({
  paymentId,
  paymentStatus,
  variant = "download",
}) => {
  const { data: receiptData, isLoading: isLoadingReceipt } = usePaymentReceipt(
    paymentId,
    paymentStatus === "SUCCESS",
  );
  const { mutate: generateReceipt, isPending: isGenerating } =
    useGeneratePaymentReceipt({
      onSuccess: (data) => {
        if (data.success && data.data.receiptUrl) {
          // Open receipt in new tab
          window.open(data.data.receiptUrl, "_blank");
          toast.success("Receipt generated successfully");
        }
      },
      onError: (error) => {
        const msg = error instanceof Error ? error.message : String(error);
        toast.error(msg || "Failed to generate receipt");
      },
    });

  const { mutate: emailReceipt, isPending: isEmailing } =
    useEmailPaymentReceipt({
      onSuccess: () => {
        toast.success("Receipt emailed successfully");
      },
      onError: (error) => {
        const msg = error instanceof Error ? error.message : String(error);
        toast.error(msg || "Failed to email receipt");
      },
    });

  const handleDownloadReceipt = () => {
    if (receiptData?.data?.receiptUrl) {
      window.open(receiptData.data.receiptUrl, "_blank");
    } else {
      // Generate receipt first
      generateReceipt(paymentId);
    }
  };

  const handleEmailReceipt = () => {
    emailReceipt(paymentId);
  };

  // Only show for successful payments
  if (
    paymentStatus &&
    paymentStatus !== "SUCCESS" &&
    paymentStatus !== "APPROVED"
  ) {
    return null;
  }

  if (isLoadingReceipt) {
    return (
      <Button variant="ternary" disabled className="text-xs px-2 py-1">
        Loading...
      </Button>
    );
  }

  return (
    <div className="flex gap-2">
      {(variant === "download" || variant === "both") && (
        <Button
          variant="ternary"
          onClick={handleDownloadReceipt}
          disabled={isGenerating}
          className="text-xs px-2 py-1"
        >
          {isGenerating
            ? "Generating..."
            : receiptData?.data?.receiptUrl
              ? "Download"
              : "Generate"}
        </Button>
      )}
      {(variant === "email" || variant === "both") && (
        <Button
          variant="ternary"
          onClick={handleEmailReceipt}
          disabled={isEmailing}
          className="text-xs px-2 py-1"
        >
          {isEmailing ? "Sending..." : "Email"}
        </Button>
      )}
    </div>
  );
};

const PaymentHistory = () => {
  // Connect to WebSocket for real-time updates
  usePaymentStatusWebSocket(true);

  const {
    data: orderHistoryData,
    isPending,
    isError,
    refetch,
  } = useUserOrderHistory();

  // Transform API data to table format
  const paymentData: PaymentHistoryItem[] = orderHistoryData?.data
    ? orderHistoryData.data.map((item) => ({
        orderId: item.orderId,
        paymentMethod: formatPaymentMethod(item.paymentMethod),
        total: item.total,
        date: formatDate(item.date),
        status: item.status,
        paymentId: item.paymentId || item.orderId, // Use orderId as fallback
      }))
    : [];

  const paymentColumns: TableColumn<PaymentHistoryItem>[] = [
    { key: "paymentMethod", label: "Payment Method", width: "w-32" },
    { key: "orderId", label: "Order", width: "w-20" },
    {
      key: "total",
      label: "Total",
      width: "w-24",
      render: (value) =>
        typeof value === "number" ? `$${value.toFixed(2)}` : value,
    },
    { key: "date", label: "Date", width: "w-32" },
    {
      key: "receipt",
      label: "Receipt",
      width: "w-24",
      render: (_value, row) => {
        // Only show receipt button for successful payments
        if (row.status === "SUCCESS" || row.status === "APPROVED") {
          return row.paymentId ? (
            <ReceiptButton
              paymentId={row.paymentId}
              paymentStatus={row.status}
              variant="both"
            />
          ) : null;
        }
        return null;
      },
    },
  ];

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading payment history...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load payment history</p>
          <Button variant="primary" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Payment History
        </h1>
        <Button variant="ternary" onClick={() => refetch()} className="text-sm">
          Refresh
        </Button>
      </div>
      {paymentData.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No payment history found</p>
        </div>
      ) : (
        <Table
          columns={paymentColumns}
          data={paymentData}
          alternatingRows={true}
          searchable={true}
          searchPlaceholder="Search payments..."
        />
      )}
    </div>
  );
};

export default PaymentHistory;
