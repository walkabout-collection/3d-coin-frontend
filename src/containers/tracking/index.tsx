"use client";
import React, { useState } from "react";
import Table from "@/src/components/common/Table";
import { TableColumn } from "@/src/components/common/Table/types";
import { TrackingData } from "./data";
import { TrackingDataItem } from "./types";
import PaymentGate from "@/src/components/PaymentGate";
import OrderStatus from "@/src/components/OrderStatus";
import {
  useUserOrdersLegacy,
  useProceedToNextStep,
} from "@/src/hooks/useQueries";
import { toast } from "react-toastify";

const Tracking = () => {
  const { data: orderData, isLoading } = useUserOrdersLegacy();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const proceedToNextStepMutation = useProceedToNextStep({
    onSuccess: (data) => {
      toast.success(data.message || "Proceeding to next step...");
      setSelectedOrderId(null);
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to proceed";
      toast.error(errorMessage);
    },
  });

  // Map order data to tracking items if available
  const ordersArray = Array.isArray(orderData) ? orderData : [];
  const trackingData: TrackingDataItem[] =
    ordersArray.length > 0
      ? ordersArray.map((order) => ({
          trackingNo: order.orderId || "N/A",
          carrier: order.carrier || "N/A",
          status: order.status,
          weightsG: order.weight ? `${order.weight}g` : "N/A",
          order: order.totalCoins?.toString() || "0",
          date: order.orderDate
            ? new Date(order.orderDate).toLocaleDateString()
            : "N/A",
          orderId: order.orderId, // Store orderId for payment gate
        }))
      : TrackingData.map((item) => ({
          ...item,
          weightsG:
            typeof item.weightsG === "number"
              ? `${item.weightsG}g`
              : item.weightsG,
        })); // Fallback to mock data with formatted weights

  const orderColumns: TableColumn<TrackingDataItem>[] = [
    { key: "trackingNo", label: "Tracking No.", width: "w-32" },
    { key: "carrier", label: "Carrier", width: "w-24" },
    { key: "status", label: "Status", width: "w-28" },
    { key: "weightsG", label: "Weights (G)", width: "w-24" },
    { key: "order", label: "Order", width: "w-20" },
    { key: "date", label: "Date", width: "w-32" },
    {
      key: "paymentStatus",
      label: "Payment Status",
      width: "w-32",
      render: (_value, row) => {
        const orderId = (row as TrackingDataItem & { orderId?: string })
          ?.orderId;
        return <OrderStatus orderId={orderId || null} compact={true} />;
      },
    },
  ];

  const handleContinueOrder = (row: TrackingDataItem) => {
    const orderId = (row as TrackingDataItem & { orderId?: string })?.orderId;
    if (orderId) {
      setSelectedOrderId(orderId);
    } else {
      toast.error("Order ID not found");
    }
  };

  const handleProceed = () => {
    if (selectedOrderId) {
      proceedToNextStepMutation.mutate(selectedOrderId);
    }
  };

  if (isLoading && !TrackingData.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading tracking information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Tracking</h1>

      {/* Payment Gate - Shows when an order is selected for continuation */}
      {selectedOrderId && (
        <div className="mb-6">
          <PaymentGate
            orderId={selectedOrderId}
            showProceedButton={true}
            onProceed={handleProceed}
          />
        </div>
      )}

      <Table columns={orderColumns} data={trackingData} />
    </div>
  );
};

export default Tracking;
