"use client";
import React, { useState, useCallback } from "react";
import Table from "@/src/components/common/Table";
import { TableColumn } from "@/src/components/common/Table/types";
import { useUserOrderHistory } from "@/src/hooks/useQueries";
import { usePaymentTimeline } from "@/src/hooks/useQueries";
import { usePaymentStatusWebSocket } from "@/src/hooks/usePaymentStatusWebSocket";
import Button from "@/src/components/common/button/Button";
import PaymentTimeline from "@/src/components/PaymentTimeline";
import SortDropdown from "@/src/components/common/SortDropdown";
import FilterDropdown from "@/src/components/common/FilterDropdown";
import Search from "@/src/components/common/search";
import { toast } from "react-toastify";
import { GetUserOrderHistoryParams } from "@/src/services/apiServices";
import { PaymentHistoryItem } from "./types";

// Format date as DD/MM/YYYY
const formatDate = (dateString: string | number | undefined): string => {
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

const PaymentTimelineModal: React.FC<{
  paymentId: string;
  isOpen: boolean;
  onClose: () => void;
}> = ({ paymentId, isOpen, onClose }) => {
  const { data: timelineData, isLoading } = usePaymentTimeline(
    isOpen ? paymentId : null,
  );

  if (!isOpen) return null;

  const events = timelineData?.data || [];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Payment Timeline</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading timeline...</span>
          </div>
        ) : (
          <PaymentTimeline events={events} currentStatus={events[0]?.status} />
        )}
      </div>
    </div>
  );
};

const PaymentHistory = () => {
  // Connect to WebSocket for real-time updates
  const { isConnected } = usePaymentStatusWebSocket(true);

  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(
    null,
  );
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);

  // Filter and sort state
  const [filters, setFilters] = useState<GetUserOrderHistoryParams>({
    page: 1,
    limit: 20,
    sortBy: "date",
    sortOrder: "desc",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: orderHistoryData,
    isPending,
    isError,
    refetch,
  } = useUserOrderHistory(filters);

  // Polling fallback when WebSocket is disconnected
  React.useEffect(() => {
    if (!isConnected && orderHistoryData) {
      // Get the actual array from nested structure
      const orderHistoryArray = Array.isArray(orderHistoryData?.data?.data)
        ? orderHistoryData.data.data
        : Array.isArray(orderHistoryData?.data)
          ? orderHistoryData.data
          : [];

      // Poll every 30 seconds for pending payments when WebSocket is disconnected
      const pendingPayments = orderHistoryArray.filter(
        (payment) =>
          payment.status === "PENDING" ||
          payment.status === "SUBMITTED" ||
          payment.status === "UPLOADED" ||
          payment.paymentStatus === "PENDING",
      );

      if (pendingPayments.length > 0) {
        const interval = setInterval(() => {
          refetch();
        }, 30000); // Poll every 30 seconds

        return () => clearInterval(interval);
      }
    }
  }, [isConnected, orderHistoryData, refetch]);

  // Handle filter changes
  const handleFilterChange = useCallback(
    (
      key: keyof GetUserOrderHistoryParams,
      value: string | number | undefined,
    ) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value || undefined,
        page: 1, // Reset to first page when filters change
      }));
    },
    [],
  );

  // Handle sort change
  const handleSortChange = useCallback((sortValue: string) => {
    if (sortValue === "newest" || sortValue === "oldest") {
      setFilters((prev) => ({
        ...prev,
        sortBy: "date",
        sortOrder: sortValue === "newest" ? "desc" : "asc",
        page: 1,
      }));
    } else if (sortValue === "amount_asc" || sortValue === "amount_desc") {
      setFilters((prev) => ({
        ...prev,
        sortBy: "amount",
        sortOrder: sortValue === "amount_asc" ? "asc" : "desc",
        page: 1,
      }));
    } else if (sortValue === "status_asc" || sortValue === "status_desc") {
      setFilters((prev) => ({
        ...prev,
        sortBy: "status",
        sortOrder: sortValue === "status_asc" ? "asc" : "desc",
        page: 1,
      }));
    }
  }, []);

  // Handle search
  const handleSearch = useCallback((search: string) => {
    setSearchTerm(search);
    setFilters((prev) => ({
      ...prev,
      search: search || undefined,
      page: 1,
    }));
  }, []);

  // Handle pagination
  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Get current sort value for SortDropdown
  const getCurrentSortValue = () => {
    if (filters.sortBy === "date") {
      return filters.sortOrder === "desc" ? "newest" : "oldest";
    } else if (filters.sortBy === "amount") {
      return filters.sortOrder === "asc" ? "amount_asc" : "amount_desc";
    } else if (filters.sortBy === "status") {
      return filters.sortOrder === "asc" ? "status_asc" : "status_desc";
    }
    return "newest";
  };

  // Transform API data to table format
  // Response structure: { success: true, data: { data: [...], pagination: {...} } }
  const orderHistoryArray = Array.isArray(orderHistoryData?.data?.data)
    ? orderHistoryData.data.data
    : Array.isArray(orderHistoryData?.data)
      ? orderHistoryData.data
      : [];

  const paymentData: PaymentHistoryItem[] = orderHistoryArray.map((item) => ({
    orderId: item.orderId,
    paymentMethod: formatPaymentMethod(item.paymentMethod),
    total: item.total,
    date: formatDate(item.date),
    status: item.status || item.paymentStatus || "N/A",
    paymentId: item.paymentId || item.orderId, // Use orderId as fallback
  }));

  const paymentColumns: TableColumn<PaymentHistoryItem>[] = [
    { key: "paymentMethod", label: "Payment Method", width: "w-32" },
    { key: "orderId", label: "Order", width: "w-20" },
    {
      key: "total",
      label: "Total",
      width: "w-24",
      render: (value) =>
        typeof value === "number" ? `$${value.toFixed(2)}` : value,
    },
    { key: "date", label: "Date", width: "w-32" },
    {
      key: "status",
      label: "Status",
      width: "w-24",
      render: (_value, row) => {
        const statusColors: Record<string, string> = {
          SUCCESS: "bg-green-100 text-green-800",
          APPROVED: "bg-green-100 text-green-800",
          PENDING: "bg-yellow-100 text-yellow-800",
          REJECTED: "bg-red-100 text-red-800",
          FAILED: "bg-red-100 text-red-800",
        };
        const colorClass =
          statusColors[row.status || ""] || "bg-gray-100 text-gray-800";
        return (
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
          >
            {row.status || "N/A"}
          </span>
        );
      },
    },
    // {
    //   key: "actions",
    //   label: "Actions",
    //   width: "w-32",
    //   render: (_value, row) => {
    //     return (
    //       <div className="flex gap-2 items-center">
    //         {row.paymentId && (
    //           <Button
    //             variant="ternary"
    //             onClick={() => {
    //               setSelectedPaymentId(row.paymentId!);
    //               setIsTimelineModalOpen(true);
    //             }}
    //             className="text-xs px-2 py-1"
    //           >
    //             Timeline
    //           </Button>
    //         )}
    //         {(row.status === "SUCCESS" || row.status === "APPROVED") &&
    //           row.paymentId && (
    //             <ReceiptButton
    //               paymentId={row.paymentId}
    //               paymentStatus={row.status}
    //               variant="download"
    //             />
    //           )}
    //       </div>
    //     );
    //   },
    // },
  ];

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading payment history...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load payment history</p>
          <Button variant="primary" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Get pagination from nested structure
  const pagination =
    orderHistoryData?.data?.pagination || orderHistoryData?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const currentPage = filters.page || 1;
  const totalEntries = pagination?.total ?? paymentData.length;
  const entriesPerPageFromAPI = pagination?.limit ?? (filters.limit || 20);

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Payment History
        </h1>
        {/* <Button variant="ternary" onClick={() => refetch()} className="text-sm">
          Refresh
        </Button> */}
      </div>

      {/* Filters and Search Section */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div className="flex items-center gap-4">
          <Search
            placeholder="Search by order ID..."
            onSearch={handleSearch}
            value={searchTerm}
            className="flex-1 max-w-md"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <FilterDropdown
            label="Status"
            options={[
              { value: "SUCCESS", label: "Success" },
              { value: "APPROVED", label: "Approved" },
              { value: "PENDING", label: "Pending" },
              { value: "REJECTED", label: "Rejected" },
              { value: "FAILED", label: "Failed" },
            ]}
            value={filters.status || ""}
            onChange={(value) => handleFilterChange("status", value)}
            placeholder="All Statuses"
          />

          <FilterDropdown
            label="Method"
            options={[
              { value: "STRIPE", label: "Credit Card" },
              { value: "QUICKBOOKS", label: "QuickBooks" },
              { value: "MANUAL", label: "Manual" },
            ]}
            value={filters.method || ""}
            onChange={(value) => handleFilterChange("method", value)}
            placeholder="All Methods"
          />

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Date Range:
            </label>
            <input
              type="date"
              value={filters.startDate || ""}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className="px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={filters.endDate || ""}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              className="px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="ml-auto">
            <SortDropdown
              options={[
                { value: "newest", label: "Newest First" },
                { value: "oldest", label: "Oldest First" },
                { value: "amount_desc", label: "Amount (High to Low)" },
                { value: "amount_asc", label: "Amount (Low to High)" },
                { value: "status_asc", label: "Status (A-Z)" },
                { value: "status_desc", label: "Status (Z-A)" },
              ]}
              value={getCurrentSortValue()}
              onChange={handleSortChange}
              showLabel={true}
            />
          </div>
        </div>
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800">
            <span className="font-medium">Connection Status:</span>{" "}
            Reconnecting... Status updates may be delayed. Payments are being
            checked every 30 seconds.
          </p>
        </div>
      )}

      {/* Table */}
      {paymentData.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg mb-2">No payment history found</p>
          <p className="text-gray-400 text-sm">
            {searchTerm || filters.status || filters.method
              ? "Try adjusting your filters"
              : "You haven't made any payments yet"}
          </p>
        </div>
      ) : (
        <>
          <Table
            columns={paymentColumns}
            data={paymentData}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={totalEntries > 10 ? handlePageChange : undefined}
            entriesPerPage={entriesPerPageFromAPI}
            totalEntries={totalEntries}
            hasNextPage={currentPage < totalPages}
            hasPreviousPage={currentPage > 1}
          />

          {/* Timeline Modal */}
          {selectedPaymentId && (
            <PaymentTimelineModal
              paymentId={selectedPaymentId}
              isOpen={isTimelineModalOpen}
              onClose={() => {
                setIsTimelineModalOpen(false);
                setSelectedPaymentId(null);
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PaymentHistory;
