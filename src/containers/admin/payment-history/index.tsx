"use client";
import { useState, useMemo, useCallback } from "react";
import { TableColumn } from "@/src/components/common/Table/types";
import { PaymentDataItem } from "./types";
import AdminTable from "@/src/components/admin/AdminTable";
import { useAdminOrderHistory } from "@/src/hooks/useQueries";

// Format API date as local date/time
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return "Invalid date";
  }
};

const AdminPaymentHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortValue, setSortValue] = useState("newest");
  const entriesPerPage = 10;

  const { data: orderHistoryData, isPending, isError } = useAdminOrderHistory();

  // Extract the actual array from nested structure: data.data
  const historyArray =
    orderHistoryData?.data?.data && Array.isArray(orderHistoryData.data.data)
      ? orderHistoryData.data.data
      : Array.isArray(orderHistoryData?.data)
        ? orderHistoryData.data
        : [];

  // Store raw data for sorting
  const rawData = historyArray.map((item) => ({
    ...item,
    rawDate: item.date ? new Date(item.date).getTime() : 0,
    rawTotal: item.total || 0,
  }));

  const displayData: PaymentDataItem[] = rawData.map((item) => ({
    paymentMethod: item.paymentMethod || "N/A",
    originalPaymentMethod: item.paymentMethod, // Store original value for status edit check
    orderTotal: `$${item.total.toFixed(2)}`,
    date: formatDate(item.date),
    orderId: item.orderId,
    customer: item.customer,
    customerEmail: item.customerEmail,
    status: item.status || item.paymentStatus, // Support both field names
    // Store raw values for sorting
    rawDate: item.rawDate,
    rawTotal: item.rawTotal,
  }));

  // Sort the data based on sortValue
  const sortedData = useMemo(() => {
    const data = [...displayData];

    if (sortValue === "newest") {
      return data.sort(
        (a, b) =>
          ((b as PaymentDataItem).rawDate || 0) -
          ((a as PaymentDataItem).rawDate || 0),
      );
    } else if (sortValue === "oldest") {
      return data.sort(
        (a, b) =>
          ((a as PaymentDataItem).rawDate || 0) -
          ((b as PaymentDataItem).rawDate || 0),
      );
    } else if (sortValue === "amount_asc") {
      return data.sort(
        (a, b) =>
          ((a as PaymentDataItem).rawTotal || 0) -
          ((b as PaymentDataItem).rawTotal || 0),
      );
    } else if (sortValue === "amount_desc") {
      return data.sort(
        (a, b) =>
          ((b as PaymentDataItem).rawTotal || 0) -
          ((a as PaymentDataItem).rawTotal || 0),
      );
    } else if (sortValue === "customer_asc") {
      return data.sort((a, b) =>
        (a.customer || "").localeCompare(b.customer || ""),
      );
    } else if (sortValue === "customer_desc") {
      return data.sort((a, b) =>
        (b.customer || "").localeCompare(a.customer || ""),
      );
    } else if (sortValue === "status_asc") {
      return data.sort((a, b) =>
        (a.status || "").localeCompare(b.status || ""),
      );
    } else if (sortValue === "status_desc") {
      return data.sort((a, b) =>
        (b.status || "").localeCompare(a.status || ""),
      );
    }

    return data;
  }, [displayData, sortValue]);

  const handleSortChange = useCallback((sort: string) => {
    setSortValue(sort);
    setCurrentPage(1); // Reset to first page when sorting changes
  }, []);

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
      {sortedData.length > 0 ? (
        <AdminTable
          columns={paymentColumns}
          data={sortedData}
          alternatingRows={true}
          searchable={true}
          searchPlaceholder="Search payments..."
          sortable={true}
          currentSort={sortValue}
          onSortChange={handleSortChange}
          sortOptions={[
            { value: "newest", label: "Newest To Oldest" },
            { value: "oldest", label: "Oldest To Newest" },
            { value: "amount_asc", label: "Amount (Low to High)" },
            { value: "amount_desc", label: "Amount (High to Low)" },
            { value: "customer_asc", label: "Customer (A to Z)" },
            { value: "customer_desc", label: "Customer (Z to A)" },
            { value: "status_asc", label: "Status (A to Z)" },
            { value: "status_desc", label: "Status (Z to A)" },
          ]}
          pagination={{
            currentPage,
            entriesPerPage,
            totalEntries: sortedData.length,
            totalPages: Math.ceil(sortedData.length / entriesPerPage),
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
