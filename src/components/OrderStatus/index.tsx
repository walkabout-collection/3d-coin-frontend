"use client";
import React from "react";
import { useOrderPaymentStatus } from "@/src/hooks/useQueries";
import { PaymentStatus } from "@/src/services/apiServices";
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface OrderStatusProps {
  orderId?: string | null;
  status?: PaymentStatus; // Direct status prop (if provided, skips API call)
  showLabel?: boolean;
  className?: string;
  compact?: boolean;
}

const OrderStatus: React.FC<OrderStatusProps> = ({
  orderId,
  status: directStatus,
  showLabel = true,
  className = "",
  compact = false,
}) => {
  // If directStatus is provided, use it; otherwise fetch from API
  const { data: paymentStatus, isLoading } = useOrderPaymentStatus(
    directStatus ? null : orderId || null,
  );

  // Use direct status if provided, otherwise use from API
  const status: PaymentStatus | undefined =
    directStatus || paymentStatus?.paymentStatus;

  if (!directStatus && !orderId) {
    return (
      <span className={`text-gray-500 ${className}`}>{showLabel && "N/A"}</span>
    );
  }

  if (!directStatus && isLoading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
        {!compact && showLabel && (
          <span className="text-sm text-gray-500">Checking...</span>
        )}
      </div>
    );
  }

  if (!status) {
    return (
      <span className={`text-gray-500 ${className}`}>
        {showLabel && "Unknown"}
      </span>
    );
  }

  const getStatusConfig = (status: PaymentStatus) => {
    switch (status) {
      case "PAID":
        return {
          icon: CheckCircle2,
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          label: "Paid",
        };
      case "PENDING":
        return {
          icon: Clock,
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          label: "Pending",
        };
      case "UNPAID":
        return {
          icon: XCircle,
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          label: "Unpaid",
        };
      case "FAILED":
        return {
          icon: AlertCircle,
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          label: "Failed",
        };
      case "REFUNDED":
        return {
          icon: AlertCircle,
          color: "text-orange-600",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
          label: "Refunded",
        };
      default:
        return {
          icon: AlertCircle,
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          label: "Unknown",
        };
    }
  };

  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1 ${className}`}>
        <StatusIcon
          className={`h-4 w-4 ${statusConfig.color} ${
            status === "PENDING" ? "animate-pulse" : ""
          }`}
        />
        {showLabel && (
          <span className={`text-xs font-medium ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${statusConfig.bgColor} ${statusConfig.borderColor} ${className}`}
    >
      <StatusIcon
        className={`h-4 w-4 ${statusConfig.color} ${
          status === "PENDING" ? "animate-pulse" : ""
        }`}
      />
      {showLabel && (
        <span className={`text-sm font-medium ${statusConfig.color}`}>
          {statusConfig.label}
        </span>
      )}
    </div>
  );
};

export default OrderStatus;
