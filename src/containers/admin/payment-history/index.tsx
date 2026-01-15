"use client";
import { useState } from "react";
import { TableColumn } from "@/src/components/common/Table/types";
import { PaymentDataItem } from "./types";
import AdminTable from "@/src/components/admin/AdminTable";
import { useAdminOrderHistory } from "@/src/hooks/useQueries";

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

// Format date as DD/MM/YYYY
const formatDate = (dateString: string | undefined): string => {
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

const AdminPaymentHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;

  const { data: orderHistoryData, isPending, isError } = useAdminOrderHistory();

  // Extract the actual array from nested structure: data.data
  const historyArray =
    orderHistoryData?.data?.data && Array.isArray(orderHistoryData.data.data)
      ? orderHistoryData.data.data
      : Array.isArray(orderHistoryData?.data)
        ? orderHistoryData.data
        : [];

  const displayData: PaymentDataItem[] = historyArray.map((item) => ({
    paymentMethod: formatPaymentMethod(item.paymentMethod),
    originalPaymentMethod: item.paymentMethod, // Store original value for status edit check
    orderTotal: `$${item.total.toFixed(2)}`,
    date: formatDate(item.date),
    orderId: item.orderId,
    customer: item.customer,
    customerEmail: item.customerEmail,
    status: item.status || item.paymentStatus, // Support both field names
  }));

  const paymentColumns: TableColumn<PaymentDataItem>[] = [
    {
      key: "paymentMethod",
      label: "Payment Method",
      width: "w-32",
    },
    {
      key: "orderTotal",
      label: "Order Total",
      width: "w-24",
    },
    {
      key: "date",
      label: "Date",
      width: "w-32",
    },
    {
      key: "orderId",
      label: "Order ID",
      width: "w-42",
    },
    {
      key: "customer",
      label: "Customer Name",
      width: "w-40",
    },
    {
      key: "customerEmail",
      label: "Customer Email",
      width: "w-48",
    },
    {
      key: "status",
      label: "Status",
      width: "w-32",
    },
  ];

  if (isPending) {
    return (
      <div className="min-h-screen">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Loading payment history...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen">
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">Error loading payment history</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Payment History
      </h1>
      {displayData.length > 0 ? (
        <AdminTable
          columns={paymentColumns}
          data={displayData}
          alternatingRows={true}
          searchable={true}
          searchPlaceholder="Search payments..."
          sortable={true}
          currentSort="newest"
          pagination={{
            currentPage,
            entriesPerPage,
            totalEntries: displayData.length,
            totalPages: Math.ceil(displayData.length / entriesPerPage),
            onPageChange: (page: number) => setCurrentPage(page),
          }}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No payment history found</p>
        </div>
      )}
    </div>
  );
};

export default AdminPaymentHistory;
