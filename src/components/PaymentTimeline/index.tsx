"use client";
import React from "react";
import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";

export interface PaymentTimelineEvent {
  status: "PENDING" | "SUBMITTED" | "APPROVED" | "REJECTED" | "COMPLETED";
  timestamp: string;
  message?: string;
  adminNote?: string;
}

interface PaymentTimelineProps {
  events: PaymentTimelineEvent[];
  currentStatus?: string;
}

const PaymentTimeline: React.FC<PaymentTimelineProps> = ({
  events,
  currentStatus,
}) => {
  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "APPROVED":
      case "COMPLETED":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "REJECTED":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "SUBMITTED":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "PENDING":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "APPROVED":
      case "COMPLETED":
        return "text-green-600 bg-green-50 border-green-200";
      case "REJECTED":
        return "text-red-600 bg-red-50 border-red-200";
      case "SUBMITTED":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "PENDING":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const formatTimestamp = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return timestamp;
    }
  };

  // Sort events by timestamp (newest first)
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  if (sortedEvents.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm">
        No payment timeline available
      </div>
    );
  }

  return (
    <div className="payment-timeline space-y-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        Payment Timeline
      </h3>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        {sortedEvents.map((event, index) => {
          const isLatest = index === 0;
          const isActive = currentStatus === event.status;

          return (
            <div key={index} className="relative flex items-start gap-4 pb-6">
              {/* Icon */}
              <div
                className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  isActive || isLatest
                    ? "bg-white border-blue-500"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                {getStatusIcon(event.status)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    event.status,
                  )}`}
                >
                  {event.status}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {event.message || `Payment status changed to ${event.status}`}
                </p>
                {event.adminNote && (
                  <p className="text-xs text-gray-500 mt-1 italic">
                    Admin note: {event.adminNote}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {formatTimestamp(event.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentTimeline;
