"use client";
import React, { useState } from "react";
import Table from "@/src/components/common/Table";
import { TableColumn } from "@/src/components/common/Table/types";
import { useUserOrderHistory } from "@/src/hooks/useQueries";
import {
  usePaymentReceipt,
  useGeneratePaymentReceipt,
  useEmailPaymentReceipt,
  usePaymentTimeline,
} from "@/src/hooks/useQueries";
import { usePaymentStatusWebSocket } from "@/src/hooks/usePaymentStatusWebSocket";
import Button from "@/src/components/common/button/Button";
import PaymentTimeline from "@/src/components/PaymentTimeline";
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

const PaymentTimelineModal: React.FC<{
  paymentId: string;
  isOpen: boolean;
  onClose: () => void;
}> = ({ paymentId, isOpen, onClose }) => {
  const { data: timelineData, isLoading } = usePaymentTimeline(
    isOpen ? paymentId : null,
  );

  if (!isOpen) return null;

  const events = timelineData?.data || [];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Payment Timeline</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading timeline...</span>
          </div>
        ) : (
          <PaymentTimeline events={events} currentStatus={events[0]?.status} />
        )}
      </div>
    </div>
  );
};

const PaymentHistory = () => {
  // Connect to WebSocket for real-time updates
  const { isConnected } = usePaymentStatusWebSocket(true);

  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(
    null,
  );
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);

  const {
    data: orderHistoryData,
    isPending,
    isError,
    refetch,
  } = useUserOrderHistory();

  // Polling fallback when WebSocket is disconnected
  React.useEffect(() => {
    if (!isConnected && orderHistoryData?.data) {
      // Poll every 30 seconds for pending payments when WebSocket is disconnected
      const pendingPayments = orderHistoryData.data.filter(
        (payment) =>
          payment.status === "PENDING" ||
          payment.status === "SUBMITTED" ||
          payment.status === "UPLOADED",
      );

      if (pendingPayments.length > 0) {
        const interval = setInterval(() => {
          refetch();
        }, 30000); // Poll every 30 seconds

        return () => clearInterval(interval);
      }
    }
  }, [isConnected, orderHistoryData, refetch]);

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
      key: "status",
      label: "Status",
      width: "w-24",
      render: (_value, row) => {
        const statusColors: Record<string, string> = {
          SUCCESS: "bg-green-100 text-green-800",
          APPROVED: "bg-green-100 text-green-800",
          PENDING: "bg-yellow-100 text-yellow-800",
          REJECTED: "bg-red-100 text-red-800",
          FAILED: "bg-red-100 text-red-800",
        };
        const colorClass =
          statusColors[row.status || ""] || "bg-gray-100 text-gray-800";
        return (
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
          >
            {row.status || "N/A"}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      width: "w-32",
      render: (_value, row) => {
        return (
          <div className="flex gap-2 items-center">
            {row.paymentId && (
              <Button
                variant="ternary"
                onClick={() => {
                  setSelectedPaymentId(row.paymentId!);
                  setIsTimelineModalOpen(true);
                }}
                className="text-xs px-2 py-1"
              >
                Timeline
              </Button>
            )}
            {(row.status === "SUCCESS" || row.status === "APPROVED") &&
              row.paymentId && (
                <ReceiptButton
                  paymentId={row.paymentId}
                  paymentStatus={row.status}
                  variant="download"
                />
              )}
          </div>
        );
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
        <>
          {!isConnected && (
            <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <span className="font-medium">Connection Status:</span>{" "}
                Reconnecting... Status updates may be delayed. Payments are
                being checked every 30 seconds.
              </p>
            </div>
          )}
          <Table
            columns={paymentColumns}
            data={paymentData}
            alternatingRows={true}
            searchable={true}
            searchPlaceholder="Search payments..."
          />
          {selectedPaymentId && (
            <PaymentTimelineModal
              paymentId={selectedPaymentId}
              isOpen={isTimelineModalOpen}
              onClose={() => {
                setIsTimelineModalOpen(false);
                setSelectedPaymentId(null);
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PaymentHistory;
