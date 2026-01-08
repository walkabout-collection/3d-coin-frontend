"use client";
import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { usePaymentStatusWebSocket } from "@/src/hooks/usePaymentStatusWebSocket";
import {
  usePaymentNotifications,
  useMarkNotificationAsRead,
} from "@/src/hooks/useQueries";
import { useQueryClient } from "@tanstack/react-query";

interface NotificationBadgeProps {
  className?: string;
  onClick?: () => void;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  className = "",
  onClick,
}) => {
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const queryClient = useQueryClient();

  // Connect to WebSocket for payment status updates
  const { isConnected } = usePaymentStatusWebSocket(true);

  // Get payment notifications
  const { data: notificationsData } = usePaymentNotifications();

  // Mark notification as read mutation
  const markAsRead = useMarkNotificationAsRead({
    onSuccess: () => {
      // Invalidate notifications query to refresh unread count
      queryClient.invalidateQueries({ queryKey: ["paymentNotifications"] });
    },
  });

  // Calculate unread count from API
  const unreadCount =
    notificationsData?.data?.filter((n) => !n.read).length || 0;

  // Listen for payment status updates
  useEffect(() => {
    const handlePaymentStatusUpdate = (event: CustomEvent) => {
      const { status } = event.detail;

      // Show notification indicator for manual payments that are approved/rejected
      if (status === "APPROVED" || status === "REJECTED") {
        setHasNewNotification(true);

        // Clear notification indicator after 5 seconds
        setTimeout(() => {
          setHasNewNotification(false);
        }, 5000);
      }
    };

    window.addEventListener(
      "paymentStatusUpdate",
      handlePaymentStatusUpdate as EventListener,
    );

    return () => {
      window.removeEventListener(
        "paymentStatusUpdate",
        handlePaymentStatusUpdate as EventListener,
      );
    };
  }, []);

  const handleClick = () => {
    setHasNewNotification(false);

    // Mark all unread notifications as read
    const unreadNotifications =
      notificationsData?.data?.filter((n) => !n.read) || [];
    unreadNotifications.forEach((notification) => {
      markAsRead.mutate(notification.id);
    });

    if (onClick) {
      onClick();
    }
  };

  if (unreadCount === 0 && !hasNewNotification) {
    return (
      <button
        onClick={handleClick}
        className={`relative p-2 rounded-full hover:bg-gray-100 transition ${className}`}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-gray-600" />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`relative p-2 rounded-full hover:bg-gray-100 transition ${className}`}
      aria-label={`${unreadCount} unread notifications`}
    >
      <Bell className="h-5 w-5 text-gray-600" />
      <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white ring-2 ring-white">
        {unreadCount > 9 ? "9+" : unreadCount}
      </span>
      {hasNewNotification && (
        <span className="absolute top-1 right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
      )}
    </button>
  );
};

export default NotificationBadge;
