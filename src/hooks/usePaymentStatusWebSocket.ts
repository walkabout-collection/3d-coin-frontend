"use client";
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface PaymentStatusUpdate {
  paymentId: string;
  status:
    | "PENDING"
    | "SUCCESS"
    | "FAILED"
    | "CANCELLED"
    | "APPROVED"
    | "REJECTED"
    | "SUBMITTED"
    | "UPLOADED";
  message?: string;
  receiptUrl?: string;
  adminNote?: string;
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

    // Helper function to check if user is authenticated
    const getCookie = (name: string): string | null => {
      if (typeof document === "undefined") return null;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
      return null;
    };

    // Only connect if user is authenticated (has a token)
    const token = getCookie("token");
    if (!token) {
      // No token, don't attempt to connect
      return;
    }

    // In development, optionally skip WebSocket if backend is likely unavailable
    // Set NEXT_PUBLIC_DISABLE_WS=true to disable WebSocket connections
    if (
      process.env.NODE_ENV === "development" &&
      process.env.NEXT_PUBLIC_DISABLE_WS === "true"
    ) {
      return;
    }

    const connectWebSocket = () => {
      // Skip if we've exceeded max reconnection attempts
      if (reconnectAttempts.current >= maxReconnectAttempts) {
        return;
      }

      try {
        // Get WebSocket URL from environment or use default
        let wsUrl =
          process.env.NEXT_PUBLIC_WS_URL ||
          process.env.NEXT_PUBLIC_BASE_URL?.replace(/^http/, "ws") ||
          "ws://localhost:8000";

        // Remove /api prefix if present (WebSocket endpoints typically don't use it)
        wsUrl = wsUrl.replace(/\/api$/, "");

        // Create WebSocket connection
        // Note: Browser will log connection failures automatically - this is expected
        // when backend is not available and cannot be fully suppressed
        const ws = new WebSocket(`${wsUrl}/ws/payment-status-updates`);

        let pingInterval: NodeJS.Timeout | null = null;

        ws.onopen = () => {
          // Only log in development if explicitly needed for debugging
          if (
            process.env.NODE_ENV === "development" &&
            process.env.NEXT_PUBLIC_DEBUG_WS === "true"
          ) {
            console.log("Payment status WebSocket connected");
          }
          reconnectAttempts.current = 0;

          // Start ping interval to keep connection alive (every 30 seconds)
          pingInterval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: "ping" }));
            }
          }, 30000);
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
            queryClient.invalidateQueries({
              queryKey: ["paymentTimeline", data.paymentId],
            });
            queryClient.invalidateQueries({
              queryKey: ["paymentNotifications"],
            });

            // Dispatch custom event for manual payment status updates
            if (
              data.status === "APPROVED" ||
              data.status === "REJECTED" ||
              data.status === "PENDING"
            ) {
              window.dispatchEvent(
                new CustomEvent("paymentStatusUpdate", {
                  detail: {
                    paymentId: data.paymentId,
                    status: data.status,
                    message: data.message,
                  },
                }),
              );
            }

            // Show toast notifications based on status
            if (data.status === "SUCCESS" || data.status === "APPROVED") {
              toast.success(data.message || "Payment completed successfully!", {
                autoClose: 5000,
              });
            } else if (data.status === "FAILED" || data.status === "REJECTED") {
              toast.error(data.message || "Payment failed. Please try again.", {
                autoClose: 5000,
              });
            } else if (data.status === "CANCELLED") {
              toast.info(data.message || "Payment was cancelled.", {
                autoClose: 3000,
              });
            } else if (data.status === "PENDING") {
              toast.info(data.message || "Payment is being processed...", {
                autoClose: 3000,
              });
            }
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        };

        ws.onerror = () => {
          // WebSocket error events don't provide detailed error info in the event object
          // Silently handle errors - the reconnection logic will handle the retry automatically
          // Only log in development if explicitly needed for debugging
          if (
            process.env.NODE_ENV === "development" &&
            process.env.NEXT_PUBLIC_DEBUG_WS === "true"
          ) {
            const readyStateText =
              ws.readyState === WebSocket.CONNECTING
                ? "CONNECTING"
                : ws.readyState === WebSocket.OPEN
                  ? "OPEN"
                  : ws.readyState === WebSocket.CLOSING
                    ? "CLOSING"
                    : ws.readyState === WebSocket.CLOSED
                      ? "CLOSED"
                      : "UNKNOWN";

            console.warn(
              `Payment status WebSocket error - State: ${readyStateText}, URL: ${ws.url}. Will attempt to reconnect...`,
            );
          }
        };

        ws.onclose = () => {
          // Only log in development if explicitly needed for debugging
          if (
            process.env.NODE_ENV === "development" &&
            process.env.NEXT_PUBLIC_DEBUG_WS === "true"
          ) {
            console.log("Payment status WebSocket disconnected");
          }

          // Stop ping interval
          if (pingInterval) {
            clearInterval(pingInterval);
            pingInterval = null;
          }

          // Attempt to reconnect with exponential backoff
          if (reconnectAttempts.current < maxReconnectAttempts) {
            const delay = Math.min(
              1000 * 2 ** reconnectAttempts.current,
              30000,
            );
            reconnectAttempts.current++;

            reconnectTimeoutRef.current = setTimeout(() => {
              if (
                process.env.NODE_ENV === "development" &&
                process.env.NEXT_PUBLIC_DEBUG_WS === "true"
              ) {
                console.log(
                  `Attempting to reconnect WebSocket (attempt ${reconnectAttempts.current})...`,
                );
              }
              connectWebSocket();
            }, delay);
          } else {
            // Only log error in development if explicitly needed for debugging
            if (
              process.env.NODE_ENV === "development" &&
              process.env.NEXT_PUBLIC_DEBUG_WS === "true"
            ) {
              console.error(
                "Max WebSocket reconnection attempts reached. Please refresh the page.",
              );
            }
            // Don't show error toast - user can still use the app
            // Payment status will refresh when navigating pages or manually refreshing
          }
        };

        wsRef.current = ws;
      } catch (error) {
        // Only log in development if explicitly needed for debugging
        if (
          process.env.NODE_ENV === "development" &&
          process.env.NEXT_PUBLIC_DEBUG_WS === "true"
        ) {
          console.error("Failed to connect WebSocket:", error);
        }
      }
    };

    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (wsRef.current) {
        try {
          // Only close if connection is open or connecting
          // Skip closing if already closed to avoid triggering browser error logs
          const readyState = wsRef.current.readyState;
          if (
            readyState === WebSocket.OPEN ||
            readyState === WebSocket.CONNECTING
          ) {
            // Set a flag to prevent error logging during cleanup
            wsRef.current.onerror = null; // Remove error handler before closing
            wsRef.current.close(1000, "Component unmounting"); // Normal closure
          }
        } catch (err) {
          // Silently ignore errors during cleanup
        } finally {
          wsRef.current = null;
        }
      }
    };
  }, [enabled, queryClient]);

  return {
    isConnected: wsRef.current?.readyState === WebSocket.OPEN,
  };
};
