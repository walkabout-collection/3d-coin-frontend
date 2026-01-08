"use client";
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface PaymentStatusUpdate {
  paymentId: string;
  status: "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";
  message?: string;
  receiptUrl?: string;
}

/**
 * WebSocket hook for real-time payment status updates
 * Connects to the payment-status-updates channel
 */
export const usePaymentStatusWebSocket = (enabled: boolean = true) => {
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const connectWebSocket = () => {
      try {
        // Get WebSocket URL from environment or use default
        const wsUrl =
          process.env.NEXT_PUBLIC_WS_URL ||
          process.env.NEXT_PUBLIC_BASE_URL?.replace(/^http/, "ws") ||
          "ws://localhost:8000";

        const ws = new WebSocket(`${wsUrl}/ws/payment-status-updates`);

        ws.onopen = () => {
          console.log("Payment status WebSocket connected");
          reconnectAttempts.current = 0;

          // Send authentication token if available
          const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("token="))
            ?.split("=")[1];

          if (token) {
            ws.send(
              JSON.stringify({
                type: "auth",
                token,
              }),
            );
          }
        };

        ws.onmessage = (event) => {
          try {
            const data: PaymentStatusUpdate = JSON.parse(event.data);

            // Update payment status in React Query cache
            queryClient.invalidateQueries({
              queryKey: ["userOrderHistory"],
            });
            queryClient.invalidateQueries({
              queryKey: ["userOrders"],
            });
            queryClient.invalidateQueries({
              queryKey: ["paymentReceipt", data.paymentId],
            });

            // Show toast notifications based on status
            if (data.status === "SUCCESS") {
              toast.success(data.message || "Payment completed successfully!", {
                autoClose: 5000,
              });
            } else if (data.status === "FAILED") {
              toast.error(data.message || "Payment failed. Please try again.", {
                autoClose: 5000,
              });
            } else if (data.status === "CANCELLED") {
              toast.info(data.message || "Payment was cancelled.", {
                autoClose: 3000,
              });
            }
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        };

        ws.onerror = (error) => {
          console.error("Payment status WebSocket error:", error);
        };

        ws.onclose = () => {
          console.log("Payment status WebSocket disconnected");

          // Attempt to reconnect with exponential backoff
          if (reconnectAttempts.current < maxReconnectAttempts) {
            const delay = Math.min(
              1000 * 2 ** reconnectAttempts.current,
              30000,
            );
            reconnectAttempts.current++;

            reconnectTimeoutRef.current = setTimeout(() => {
              console.log(
                `Attempting to reconnect WebSocket (attempt ${reconnectAttempts.current})...`,
              );
              connectWebSocket();
            }, delay);
          } else {
            console.error(
              "Max WebSocket reconnection attempts reached. Please refresh the page.",
            );
            toast.error(
              "Connection lost. Please refresh the page to receive payment updates.",
              {
                autoClose: false,
              },
            );
          }
        };

        wsRef.current = ws;
      } catch (error) {
        console.error("Failed to connect WebSocket:", error);
      }
    };

    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [enabled, queryClient]);

  return {
    isConnected: wsRef.current?.readyState === WebSocket.OPEN,
  };
};
