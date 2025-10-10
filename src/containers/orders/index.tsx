"use client";
import React, { useState } from "react";
import Table from "@/src/components/common/Table";
import { TableColumn } from "@/src/components/common/Table/types";
import { OrderDataItem } from "./types";
import PayNowModal from "@/src/components/PayNowModal";
import { useCreateUserPayment, useUserOrders } from "@/src/hooks/useQueries";
import { toast } from "react-toastify";

const Orders = () => {
  const { data: orderData = [], isPending, isError } = useUserOrders();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDataItem | null>(
    null
  );
  const { mutate: createUserPayment, isPending: isCreatingPayment } =
    useCreateUserPayment({
      onSuccess: () => {
        toast.success("Payment created successfully");
        setIsModalOpen(false);
      },
      onError: (error) => {
        console.error("Error creating payment:", error);
        toast.error("Payment creation failed");
      },
    });



  const handlePayNowClick = (row: OrderDataItem) => {
    setSelectedOrder(row);
    setIsModalOpen(true);
  };

  const handleConfirmPayment = async (order: OrderDataItem) => {
    const { orderId, quotes, totalPrice } = order;
    console.log(orderId, quotes, totalPrice);

    if (!quotes || quotes.length === 0) {
      console.error("No quotes found for this order.");
      return;
    }

    const {  method } = quotes[0];

    if (totalPrice == null || !method) {
      console.error("Missing payment details in quote.");
      return;
    }

    createUserPayment({
      orderId:order.id,
      amount:totalPrice,
      method,
    });
  };

  const orderColumns: TableColumn<OrderDataItem>[] = [
    { key: "orderId", label: "Order No.", width: "w-42" },
    {
      key: "quotes",
      label: "Packaging",
      width: "w-28",
      render: (_, row) => row.quotes?.[0]?.packaging?.description || "N/A",
    },
    {
      key: "quotes",
      label: "Order",
      width: "w-32",
      render: (_, row) => row.quotes?.[0]?.coinDesign?.name || "N/A",
    },
    {
      key: "orderDate",
      label: "Date",
      width: "w-35",
      render: (_, row) => {
        const dateValue = row.orderDate;
        if (typeof dateValue === "string" || typeof dateValue === "number") {
          return new Date(dateValue).toLocaleDateString();
        }
        return "Invalid date";
      },
    },
    {
      key: "status",
      label: "Status",
      width: "w-38",
    },
    {
      key: "payments",
      label: "Payment Method",
      width: "w-52",
      render: (_, row) => row.quotes?.[0]?.method || "N/A",
    },
    {
      key: "totalPrice",
      label: "Price",
      width: "w-42",
      render: (value) =>
        value != null ? `$${Number(value).toFixed(2)}` : "N/A",
    },
  ];

  const actions: {
    label: string;
    onClick?: (row: OrderDataItem) => void;
    variant?: "primary" | "secondary" | "danger" | "success";
    show?: (row: OrderDataItem) => boolean;
  }[] = [
    {
      label: "Pay Now",
      onClick: handlePayNowClick,
      variant: "primary",
      show: (row: OrderDataItem) =>
        row.status === "PENDING" && row.quotes[0].method === "MANUAL",
    },
    {
      label: "Paid",
      variant: "success",
      show: (row: OrderDataItem) =>
        row.status === "APPROVED" && row.quotes[0].method === "MANUAL",
    },
  ];

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Order History
      </h1>
      {orderData.length > 0 ? (
        <Table
          columns={orderColumns}
          data={orderData}
          alternatingRows={true}
          searchable={true}
          searchPlaceholder="Search orders..."
          sortable={true}
          currentSort="newest"
          showActions={true}
          actions={actions}
        />
      ) : (
        <div>No orders found</div>
      )}
      {selectedOrder && (
        <PayNowModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          order={selectedOrder}
          price={selectedOrder.totalPrice || 0}
          onConfirmPayment={handleConfirmPayment}
        />
      )}
    </div>
  );
};

export default Orders;
