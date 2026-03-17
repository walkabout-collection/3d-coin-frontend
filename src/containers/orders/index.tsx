"use client";
import React, { useState, useEffect } from "react";
import Table from "@/src/components/common/Table";
import { TableColumn } from "@/src/components/common/Table/types";
import { OrderDataItem } from "./types";
import PayNowModal from "@/src/components/PayNowModal";
import QuickBooksPaymentModal from "@/src/components/QuickBooks/QuickBooksPaymentModal";
import {
  useCreateUserPayment,
  useUserOrders,
  useUserOrderHistory,
} from "@/src/hooks/useQueries";
import { UserOrder } from "@/src/services/apiServices";
import { toast } from "react-toastify";

// Format payment method display
const formatPaymentMethod = (method: string | undefined): string => {
  if (!method) return "N/A";
  switch (method.toUpperCase()) {
    case "STRIPE":
      return "STRIPE";
    case "MANUAL":
      return "MANUAL";
    case "QUICKBOOKS":
      return "QUICKBOOKS";
    default:
      return method;
  }
};

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

const Orders = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;

  // Try to use the new order history API, fallback to paginated user orders
  const {
    data: orderHistoryData,
    isPending: isHistoryPending,
    isError: isHistoryError,
  } = useUserOrderHistory();

  const {
    data: orderDataResponse,
    isPending,
    isError,
    refetch,
  } = useUserOrders(
    {
      page: currentPage,
      limit: entriesPerPage,
    },
    {
      staleTime: 0,
      queryKey: [],
    },
  );

  // Force refetch when page changes
  useEffect(() => {
    refetch();
  }, [currentPage, refetch]);

  // Handle both array and paginated response
  const orderDataArray = Array.isArray(orderDataResponse)
    ? orderDataResponse
    : orderDataResponse?.data || [];
  const paginationData = orderDataResponse?.pagination;

  // Filter out orders that have quotes with designStatus: "DRAFT"
  const filteredOrderDataArray = orderDataArray.filter(
    (order: UserOrder | OrderDataItem) => {
      // Check if order has quotes array
      if (
        "Quote" in order &&
        Array.isArray(order.Quote) &&
        order.Quote.length > 0
      ) {
        // Filter out if any quote has designStatus: "DRAFT"
        return !order.Quote.some(
          (quote) => quote.designStatus?.toUpperCase() === "DRAFT",
        );
      }
      if (
        "quotes" in order &&
        Array.isArray(order.quotes) &&
        order.quotes.length > 0
      ) {
        // Filter out if any quote has designStatus: "DRAFT"
        return !order.quotes.some(
          (quote) => quote.designStatus?.toUpperCase() === "DRAFT",
        );
      }
      // If no quotes, include the order
      return true;
    },
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuickBooksModalOpen, setIsQuickBooksModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDataItem | null>(
    null,
  );

  const { mutate: createUserPayment } = useCreateUserPayment({
    onSuccess: () => {
      toast.success("Payment created successfully");
      setIsModalOpen(false);
    },
    onError: (error) => {
      console.error("Error creating payment:", error);
      toast.error("Payment creation failed");
    },
  });

  interface DisplayDataItem {
    id: string;
    orderId: string;
    userId?: string;
    carrier?: string | null;
    status: string;
    weight?: number | null;
    orderDate: string;
    totalCoins?: number | null;
    totalPrice: number;
    paymentStatus?: string;
    paymentMethod: string;
    paymentDate?: string | null;
    paymentId?: string | null;
    date: string;
    originalOrder?: OrderDataItem | UserOrder;
  }

  // Helper to extract payment status from order
  const getPaymentStatus = (order: UserOrder | OrderDataItem): string => {
    if ("paymentStatus" in order && order.paymentStatus) {
      return order.paymentStatus;
    }
    if (
      "Payment" in order &&
      Array.isArray(order.Payment) &&
      order.Payment.length > 0
    ) {
      const successPayment = order.Payment.find((p) => p.status === "SUCCESS");
      if (successPayment) return "PAID";
      const pendingPayment = order.Payment.find((p) => p.status === "PENDING");
      if (pendingPayment) return "PENDING";
      const failedPayment = order.Payment.find(
        (p) => p.status === "FAILED" || p.status === "REFUNDED",
      );
      if (failedPayment) return "FAILED";
    }
    if (
      "quotes" in order &&
      Array.isArray(order.quotes) &&
      order.quotes.length > 0
    ) {
      const quote = order.quotes[0];
      if (quote.method === "MANUAL" && order.status === "PENDING") {
        return "PENDING";
      }
      if (order.status === "APPROVED") {
        return "PAID";
      }
    }
    if (
      "payments" in order &&
      Array.isArray(order.payments) &&
      order.payments.length > 0
    ) {
      const successPayment = order.payments.find((p) => p.status === "SUCCESS");
      if (successPayment) return "PAID";
      const pendingPayment = order.payments.find((p) => p.status === "PENDING");
      if (pendingPayment) return "PENDING";
      const failedPayment = order.payments.find(
        (p) => p.status === "FAILED" || p.status === "REFUNDED",
      );
      if (failedPayment) return "FAILED";
    }
    return "UNPAID";
  };

  // Helper to extract payment date from order
  const getPaymentDate = (order: UserOrder | OrderDataItem): string | null => {
    // Priority 1: Check for paymentDate at top level (new API response structure)
    if ("paymentDate" in order && order.paymentDate) {
      return order.paymentDate;
    }
    // Priority 2: Check Payment array for successful payment's paidAt
    if (
      "Payment" in order &&
      Array.isArray(order.Payment) &&
      order.Payment.length > 0
    ) {
      const payment = order.Payment.find((p) => p.status === "SUCCESS");
      if (payment?.paidAt) {
        return payment.paidAt;
      }
    }
    // Priority 3: Check payments array (lowercase) for successful payment's paidAt
    if (
      "payments" in order &&
      Array.isArray(order.payments) &&
      order.payments.length > 0
    ) {
      const payment = order.payments.find((p) => p.status === "SUCCESS");
      if (payment?.paidAt) {
        return payment.paidAt;
      }
    }
    return null;
  };

  // Helper to extract payment ID from order
  const getPaymentId = (order: UserOrder | OrderDataItem): string | null => {
    if ("paymentId" in order && order.paymentId) {
      return order.paymentId;
    }
    if (
      "Payment" in order &&
      Array.isArray(order.Payment) &&
      order.Payment.length > 0
    ) {
      const payment = order.Payment.find((p) => p.status === "SUCCESS");
      return payment?.id || null;
    }
    if (
      "payments" in order &&
      Array.isArray(order.payments) &&
      order.payments.length > 0
    ) {
      const payment = order.payments.find((p) => p.status === "SUCCESS");
      return payment?.id || null;
    }
    return null;
  };

  // Extract order history data array (handle nested structure)
  const orderHistoryArray =
    orderHistoryData?.data?.data && Array.isArray(orderHistoryData.data.data)
      ? orderHistoryData.data.data
      : orderHistoryData?.data && Array.isArray(orderHistoryData.data)
        ? orderHistoryData.data
        : [];

  const displayData: DisplayDataItem[] =
    orderHistoryArray.length > 0
      ? orderHistoryArray.map(
          (item: UserOrder | Record<string, unknown>): DisplayDataItem => {
            // Check if item is a full UserOrder object or simplified structure
            const isUserOrder =
              "totalPrice" in item || "Quote" in item || "Payment" in item;

            if (isUserOrder) {
              // Handle full UserOrder object
              const userOrder = item as UserOrder;
              return {
                id: userOrder.id || userOrder.orderId || "",
                orderId: userOrder.orderId || userOrder.id || "",
                paymentMethod: formatPaymentMethod(
                  userOrder.paymentMethod ||
                    (Array.isArray(userOrder.Quote) && userOrder.Quote[0]
                      ? userOrder.Quote[0].method
                      : undefined) ||
                    (Array.isArray(userOrder.Payment) && userOrder.Payment[0]
                      ? userOrder.Payment[0].method
                      : undefined),
                ),
                totalPrice: userOrder.totalPrice || 0,
                totalCoins: userOrder.totalCoins ?? undefined,
                date: formatDate(userOrder.orderDate),
                orderDate: userOrder.orderDate || "",
                status: userOrder.status || "APPROVED",
                paymentStatus:
                  userOrder.paymentStatus || getPaymentStatus(userOrder),
                paymentDate: userOrder.paymentDate || getPaymentDate(userOrder),
                paymentId: userOrder.paymentId || getPaymentId(userOrder),
                originalOrder: userOrder,
              };
            } else {
              // Handle simplified structure
              const simplified = item as Record<string, unknown>;
              const getString = (key: string): string => {
                const value = simplified[key];
                return typeof value === "string" ? value : "";
              };
              const getNumber = (key: string): number => {
                const value = simplified[key];
                return typeof value === "number" ? value : 0;
              };
              const getStringOrUndefined = (
                key: string,
              ): string | undefined => {
                const value = simplified[key];
                return typeof value === "string" ? value : undefined;
              };
              const getNumberOrUndefined = (
                key: string,
              ): number | undefined => {
                const value = simplified[key];
                return typeof value === "number" ? value : undefined;
              };

              return {
                id: getString("orderId"),
                orderId: getString("orderId"),
                paymentMethod: formatPaymentMethod(
                  getStringOrUndefined("paymentMethod"),
                ),
                totalPrice: getNumber("total"),
                totalCoins: getNumberOrUndefined("totalCoins"),
                date: formatDate(getStringOrUndefined("date")),
                orderDate: getString("date") || getString("orderDate"),
                status: getString("status") || "APPROVED",
                paymentStatus: getString("paymentStatus") || "UNPAID",
                paymentDate: getStringOrUndefined("paymentDate") || null,
                paymentId: getStringOrUndefined("paymentId") || null,
              };
            }
          },
        )
      : filteredOrderDataArray.map(
          (order: UserOrder | OrderDataItem): DisplayDataItem => {
            const isUserOrder = "paymentMethod" in order || "Quote" in order;
            let paymentMethod: string;

            if (isUserOrder) {
              const userOrder = order as UserOrder;
              paymentMethod = formatPaymentMethod(
                userOrder.paymentMethod ||
                  (Array.isArray(userOrder.Quote) && userOrder.Quote[0]
                    ? userOrder.Quote[0].method
                    : undefined) ||
                  (Array.isArray(userOrder.Payment) && userOrder.Payment[0]
                    ? userOrder.Payment[0].method
                    : undefined),
              );
            } else {
              paymentMethod = formatPaymentMethod(
                (order as OrderDataItem).quotes?.[0]?.method,
              );
            }

            return {
              id: order.id || order.orderId || "",
              orderId: order.orderId || order.id || "",
              userId: "userId" in order ? order.userId : undefined,
              carrier: "carrier" in order ? order.carrier : undefined,
              status: order.status || "APPROVED",
              weight: "weight" in order ? order.weight : undefined,
              orderDate: order.orderDate || "",
              totalCoins: "totalCoins" in order ? order.totalCoins : undefined,
              totalPrice: order.totalPrice || 0,
              paymentStatus: getPaymentStatus(order),
              paymentMethod: paymentMethod,
              paymentDate: getPaymentDate(order),
              paymentId: getPaymentId(order),
              date: formatDate(order.orderDate),
              originalOrder: order,
            };
          },
        );

  const isDataPending = orderHistoryData ? isHistoryPending : isPending;
  const isDataError = orderHistoryData ? isHistoryError : isError;

  const handleConfirmPayment = async (order: unknown) => {
    const originalOrder =
      order && typeof order === "object" && "originalOrder" in (order as object)
        ? (order as Record<string, unknown>)["originalOrder"]
        : order;

    if (!originalOrder || typeof originalOrder !== "object") {
      console.error("Invalid order object");
      return;
    }

    const orig = originalOrder as Record<string, unknown>;
    const maybeQuotes = orig["quotes"];

    if (!Array.isArray(maybeQuotes) || maybeQuotes.length === 0) {
      console.error("No quotes found for this order.");
      return;
    }

    const firstQuote = maybeQuotes[0] as Record<string, unknown>;
    const methodString =
      typeof firstQuote["method"] === "string"
        ? (firstQuote["method"] as string)
        : undefined;

    if (!methodString) {
      console.error("Missing payment method in quote.");
      return;
    }

    const validMethods = ["STRIPE", "QUICKBOOKS", "MANUAL"] as const;
    const method = validMethods.includes(
      methodString.toUpperCase() as (typeof validMethods)[number],
    )
      ? (methodString.toUpperCase() as "STRIPE" | "QUICKBOOKS" | "MANUAL")
      : undefined;

    const quoteId =
      typeof firstQuote["id"] === "string"
        ? (firstQuote["id"] as string)
        : String(firstQuote["id"]);

    const totalPrice =
      typeof orig["totalPrice"] === "number"
        ? (orig["totalPrice"] as number)
        : undefined;

    if (totalPrice == null || !method) {
      console.error("Missing payment details in quote.");
      return;
    }

    createUserPayment({
      quoteId,
      amount: totalPrice,
      method,
    });
  };

  const formatPaymentStatus = (status: string | undefined): string => {
    if (!status) return "N/A";
    return status.toUpperCase();
  };

  const formatOrderStatus = (status: string | undefined): string => {
    if (!status) return "N/A";
    return status;
  };

  const orderColumns: TableColumn<DisplayDataItem>[] = [
    {
      key: "orderId",
      label: "Order ID",
      width: "w-40",
    },
    {
      key: "status",
      label: "Order Status",
      width: "w-32",
      render: (value) => formatOrderStatus(value as string),
    },
    {
      key: "paymentStatus",
      label: "Payment Status",
      width: "w-32",
      render: (value) => formatPaymentStatus(value as string),
    },
    {
      key: "totalPrice",
      label: "Order Total",
      width: "w-28",
      render: (value) =>
        value != null ? `$${Number(value).toFixed(2)}` : "N/A",
    },
    {
      key: "totalCoins",
      label: "Total Coins",
      width: "w-24",
      render: (value) => (value != null ? String(value) : "N/A"),
    },
    {
      key: "paymentMethod",
      label: "Payment Method",
      width: "w-32",
    },
    {
      key: "paymentDate",
      label: "Payment Date",
      width: "w-32",
      render: (value) => (value ? formatDate(value as string) : "N/A"),
    },
    {
      key: "date",
      label: "Order Date",
      width: "w-32",
    },
  ];

  // const actions: {
  //   label: string;
  //   onClick?: (row: DisplayDataItem) => void;
  //   variant?: "primary" | "secondary" | "danger" | "success";
  //   show?: (row: DisplayDataItem) => boolean;
  // }[] = [
  //   {
  //     label: "Pay Now",
  //     onClick: handlePayNowClick,
  //     variant: "primary",
  //     show: (row: DisplayDataItem) => {
  //       const originalOrder = row.originalOrder;
  //       if (!originalOrder) return false;
  //       if (!("quotes" in originalOrder)) return false;

  //       const paymentMethod =
  //         getPaymentMethodFromOrder(originalOrder)?.toUpperCase();

  //       return (
  //         originalOrder.status === "PENDING" &&
  //         (paymentMethod === "MANUAL" || paymentMethod === "QUICKBOOKS")
  //       );
  //     },
  //   },
  //   {
  //     label: "Paid",
  //     variant: "success",
  //     show: (row: DisplayDataItem) => {
  //       const originalOrder = row.originalOrder;
  //       if (!originalOrder) return false;
  //       if (!("quotes" in originalOrder)) return false;

  //       const paymentMethod = getPaymentMethodFromOrder(originalOrder);

  //       return (
  //         originalOrder.status === "APPROVED" && paymentMethod === "MANUAL"
  //       );
  //     },
  //   },
  // ];

  if (isDataPending) return <div>Loading...</div>;
  if (isDataError) return <div>Error loading orders</div>;

  // Calculate totals based on filtered data
  const totalEntries =
    orderHistoryArray.length > 0
      ? (orderHistoryData?.data?.pagination?.total ?? orderHistoryArray.length)
      : (paginationData?.total ?? displayData.length);
  const totalPages =
    orderHistoryData?.data?.pagination?.totalPages ??
    paginationData?.totalPages ??
    Math.ceil(displayData.length / entriesPerPage);
  const entriesPerPageFromAPI =
    orderHistoryData?.data?.pagination?.limit ??
    paginationData?.limit ??
    entriesPerPage;

  const handlePageChange = (page: number) => {
    if (page < 1) return;
    if (paginationData && page > paginationData.totalPages) return;

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Order History</h2>
      </div>

      {displayData.length > 0 ? (
        <Table
          columns={orderColumns}
          data={displayData}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          entriesPerPage={entriesPerPageFromAPI}
          totalEntries={totalEntries}
          hasNextPage={paginationData?.hasNextPage ?? currentPage < totalPages}
          hasPreviousPage={paginationData?.hasPreviousPage ?? currentPage > 1}
        />
      ) : (
        <div className="text-center py-8">No orders found</div>
      )}

      {selectedOrder && (
        <>
          <PayNowModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedOrder(null);
            }}
            order={selectedOrder}
            price={selectedOrder.totalPrice || 0}
            onConfirmPayment={handleConfirmPayment}
            onPaymentSuccess={() => {
              setIsModalOpen(false);
              setSelectedOrder(null);
            }}
          />
          <QuickBooksPaymentModal
            isOpen={isQuickBooksModalOpen}
            onClose={() => {
              setIsQuickBooksModalOpen(false);
              setSelectedOrder(null);
            }}
            quoteId={selectedOrder.quotes?.[0]?.id || ""}
            amount={selectedOrder.totalPrice || 0}
            orderId={selectedOrder.orderId}
            customerEmail={selectedOrder.quotes?.[0]?.email || undefined}
            customerName={
              selectedOrder.quotes?.[0]?.user?.firstName &&
              selectedOrder.quotes?.[0]?.user?.lastName
                ? `${selectedOrder.quotes[0].user.firstName} ${selectedOrder.quotes[0].user.lastName}`.trim()
                : selectedOrder.quotes?.[0]?.user?.firstName ||
                  selectedOrder.quotes?.[0]?.user?.email ||
                  undefined
            }
            onPaymentSuccess={() => {
              setIsQuickBooksModalOpen(false);
              setSelectedOrder(null);
              window.location.reload();
            }}
          />
        </>
      )}
    </div>
  );
};

export default Orders;
