"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useOrderPaymentStatus } from "@/src/hooks/useQueries";
import Button from "@/src/components/common/button/Button";
import { AlertCircle, Lock, Loader2, DollarSign, Calendar } from "lucide-react";
import { PaymentStatus } from "@/src/services/apiServices";

interface PaymentGateProps {
  orderId: string | null;
  children?: React.ReactNode;
  onProceed?: () => void;
  showProceedButton?: boolean;
  className?: string;
}

const PaymentGate: React.FC<PaymentGateProps> = ({
  orderId,
  children,
  onProceed,
  showProceedButton = true,
  className = "",
}) => {
  const router = useRouter();
  const {
    data: paymentStatus,
    isLoading,
    isError,
  } = useOrderPaymentStatus(orderId);

  if (!orderId) {
    return (
      <div
        className={`p-4 bg-yellow-50 border border-yellow-200 rounded-lg ${className}`}
      >
        <div className="flex items-center gap-2 text-yellow-800">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm">Order ID is required</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className={`p-6 bg-gray-50 border border-gray-200 rounded-lg ${className}`}
      >
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          <p className="text-gray-700">Checking payment status...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className={`p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}
      >
        <div className="flex items-start gap-2 text-red-800">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <div>
            <p className="font-semibold mb-1">Error checking payment status</p>
            <p className="text-sm">
              Unable to verify payment status. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!paymentStatus) {
    return null;
  }

  const {
    paymentStatus: status,
    canProceed,
    amount,
    paymentDeadline,
  } = paymentStatus;

  // If payment is complete, render children or proceed button
  if (canProceed && status === "PAID") {
    if (showProceedButton && onProceed) {
      return (
        <div className={className}>
          {children}
          <Button
            variant="primary"
            onClick={onProceed}
            className="mt-4 w-full sm:w-auto"
          >
            Continue to Next Step
          </Button>
        </div>
      );
    }
    return <div className={className}>{children}</div>;
  }

  // Payment gate - block progression
  const getStatusConfig = (status: PaymentStatus) => {
    switch (status) {
      case "PENDING":
        return {
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          textColor: "text-yellow-800",
          icon: Loader2,
          title: "Payment Processing",
          message: "Your payment is being processed. Please wait...",
        };
      case "UNPAID":
        return {
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          textColor: "text-red-800",
          icon: Lock,
          title: "Payment Required",
          message: "Payment is required to proceed to the next step.",
        };
      case "FAILED":
        return {
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          textColor: "text-red-800",
          icon: AlertCircle,
          title: "Payment Failed",
          message:
            "Payment processing failed. Please try again or use a different payment method.",
        };
      case "REFUNDED":
        return {
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
          textColor: "text-orange-800",
          icon: AlertCircle,
          title: "Payment Refunded",
          message:
            "This payment has been refunded. A new payment is required to proceed.",
        };
      default:
        return {
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          textColor: "text-gray-800",
          icon: Lock,
          title: "Payment Required",
          message: "Payment is required to proceed.",
        };
    }
  };

  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  return (
    <div
      className={`p-6 ${statusConfig.bgColor} border ${statusConfig.borderColor} rounded-lg ${className}`}
    >
      <div className="flex items-start gap-3 mb-4">
        <StatusIcon
          className={`h-6 w-6 ${statusConfig.textColor} ${
            status === "PENDING" ? "animate-spin" : ""
          }`}
        />
        <div className="flex-1">
          <h3 className={`font-semibold mb-1 ${statusConfig.textColor}`}>
            {statusConfig.title}
          </h3>
          <p className={`text-sm ${statusConfig.textColor} opacity-90`}>
            {statusConfig.message}
          </p>
        </div>
      </div>

      {amount && (
        <div
          className={`mb-4 p-3 bg-white rounded-lg border ${statusConfig.borderColor}`}
        >
          <div className="flex items-center gap-2">
            <DollarSign className={`h-4 w-4 ${statusConfig.textColor}`} />
            <span className={`text-sm font-medium ${statusConfig.textColor}`}>
              Amount Due: ${amount.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {paymentDeadline && (
        <div
          className={`mb-4 p-3 bg-white rounded-lg border ${statusConfig.borderColor}`}
        >
          <div className="flex items-center gap-2">
            <Calendar className={`h-4 w-4 ${statusConfig.textColor}`} />
            <span className={`text-sm ${statusConfig.textColor}`}>
              Payment Deadline: {new Date(paymentDeadline).toLocaleDateString()}
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="primary"
          onClick={() => router.push("/dashboard/orders")}
          className="flex-1"
        >
          Go to Payments
        </Button>
        {status === "PENDING" && (
          <Button
            variant="ternary"
            onClick={() => window.location.reload()}
            className="flex-1"
          >
            Refresh Status
          </Button>
        )}
      </div>
    </div>
  );
};

export default PaymentGate;
