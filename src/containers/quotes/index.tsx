"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Quote } from "./types";
import Search from "@/src/components/common/search";
import SortDropdown from "@/src/components/common/SortDropdown";
import {
  useUserQuotes,
  useCreateStripeCheckout,
  usePaymentNotifications,
} from "@/src/hooks/useQueries";
import PayNowModal from "@/src/components/PayNowModal";
import QuoteCard from "@/src/components/QuoteCard";
import { toast } from "react-toastify";
import {
  generateIdempotencyKey,
  storeIdempotencyKey,
  getIdempotencyKey,
  clearIdempotencyKey,
} from "@/src/utils/idempotency";
import Pagination from "@/src/components/common/Pagination";

const Quotes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [internalSort, setInternalSort] = useState("newest");
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 4; // Items per page for client-side pagination

  // Fetch all quotes (or a large number) for client-side pagination
  // Using a large limit to get all quotes, then paginate client-side
  const {
    data: quotesData,
    isPending,
    isError,
    error,
  } = useUserQuotes({
    page: 1,
    limit: 100, // Fetch a large number to get all quotes, then paginate client-side
  });

  const { data: paymentNotificationsData } = usePaymentNotifications();
  const [processingQuoteId, setProcessingQuoteId] = useState<string | null>(
    null,
  );

  const quotePaymentStatusMap = useMemo(() => {
    const map = new Map<string, "SUCCESS" | "PENDING" | "FAILED">();

    if (
      paymentNotificationsData?.success &&
      paymentNotificationsData.data?.notifications
    ) {
      const notifications = paymentNotificationsData.data.notifications;

      notifications.forEach((notification) => {
        if (notification.quoteId && notification.status) {
          const existingStatus = map.get(notification.quoteId);
          if (!existingStatus || existingStatus !== "SUCCESS") {
            map.set(notification.quoteId, notification.status);
          }
        }
      });
    }

    return map;
  }, [paymentNotificationsData]);

  const { mutate: createStripeCheckout, isPending: isCreatingCheckout } =
    useCreateStripeCheckout({
      onSuccess: (data, variables) => {
        if (data.success && data.data.url) {
          clearIdempotencyKey(variables.quoteId);
          setProcessingQuoteId(null);
          window.location.href = data.data.url;
        }
      },
      onError: (error) => {
        setProcessingQuoteId(null);
        const msg = error instanceof Error ? error.message : String(error);

        if (msg.includes("already completed") || msg.includes("already paid")) {
          toast.info("This quote has already been paid.");
        } else if (msg.includes("duplicate") || msg.includes("idempotency")) {
          toast.warning(
            "A payment session is already being processed for this quote. Please wait.",
          );
        } else if (msg.includes("network") || msg.includes("timeout")) {
          toast.error(
            "Network error. Please check your connection and try again.",
          );
        } else if (msg.includes("rate limit")) {
          toast.error("Too many requests. Please wait a moment and try again.");
        } else {
          toast.error(
            msg || "Failed to create payment session. Please try again.",
          );
        }
      },
    });

  const quotesArray: Quote[] = useMemo(() => {
    if (!quotesData) return [];

    let quotes: Quote[] = [];
    if (quotesData?.data && Array.isArray(quotesData.data)) {
      quotes = quotesData.data as Quote[];
    } else if (Array.isArray(quotesData)) {
      quotes = quotesData as Quote[];
    }

    // Filter out quotes with designStatus: "DRAFT"
    return quotes.filter(
      (quote) => quote.designStatus?.toUpperCase() !== "DRAFT",
    );
  }, [quotesData]);

  const sortData = (dataToSort: Quote[], sortValue: string) => {
    if (!sortValue || !dataToSort?.length) return dataToSort;

    return [...dataToSort].sort((a, b) => {
      switch (sortValue) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "order_asc":
          return (a.orderId || "").localeCompare(b.orderId || "");
        case "order_desc":
          return (b.orderId || "").localeCompare(a.orderId || "");
        default:
          return 0;
      }
    });
  };

  const sortedData = useMemo(() => {
    return sortData(quotesArray, internalSort);
  }, [quotesArray, internalSort]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return sortedData;
    return sortedData.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  }, [sortedData, searchTerm]);

  // Calculate client-side pagination based on filtered data
  const totalFilteredItems = filteredData.length;
  const totalPagesForFiltered = Math.ceil(totalFilteredItems / entriesPerPage);

  // Get paginated data for current page
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, entriesPerPage]);

  // Reset to page 1 when search or sort changes, or if current page is beyond total pages
  useEffect(() => {
    if (currentPage > totalPagesForFiltered && totalPagesForFiltered > 0) {
      setCurrentPage(1);
    }
  }, [searchTerm, internalSort, totalPagesForFiltered, currentPage]);

  const handleSortChange = (sort: string) => {
    setInternalSort(sort);
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1) return;
    if (page > totalPagesForFiltered) return;

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStripePayment = (quote: Quote) => {
    if (processingQuoteId === quote.id || isCreatingCheckout) {
      toast.warning("Payment is already being processed. Please wait.");
      return;
    }

    if (!quote.amount) {
      toast.error("Quote amount is missing. Please contact support.");
      return;
    }

    setProcessingQuoteId(quote.id);

    let idempotencyKey = getIdempotencyKey(quote.id);
    if (!idempotencyKey) {
      idempotencyKey = generateIdempotencyKey(quote.id);
      storeIdempotencyKey(quote.id, idempotencyKey);
    }

    createStripeCheckout({
      quoteId: quote.id,
      currency: "usd",
      idempotencyKey,
    });
  };

  const handleManualPayment = (quote: Quote) => {
    setSelectedQuote(quote);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false);
    setSelectedQuote(null);
  };

  const getQuoteStatusDisplay = (
    status: string,
    paymentStatus?: string,
    isPaid?: boolean,
    payments?: Array<{ status: string }>,
  ) => {
    // Check if payment is successful from multiple sources
    const hasSuccessfulPayment =
      isPaid ||
      paymentStatus === "PAID" ||
      paymentStatus === "SUCCESS" ||
      (payments &&
        Array.isArray(payments) &&
        payments.some((p) => p.status === "SUCCESS"));

    if (hasSuccessfulPayment) {
      return {
        text: "Payment Completed",
        color: "bg-green-100 text-green-800",
      };
    }

    switch (status.toUpperCase()) {
      case "PENDING":
        return {
          text: "Pending Approval",
          color: "bg-yellow-100 text-yellow-800",
        };
      case "APPROVED":
        return {
          text: "Approved - Payment Required",
          color: "bg-blue-100 text-blue-800",
        };
      case "REJECTED":
        return { text: "Rejected", color: "bg-red-100 text-red-800" };
      default:
        return { text: status, color: "bg-gray-100 text-gray-800" };
    }
  };

  const sortOptionsDropdown = [
    { value: "newest", label: "Newest To Oldest" },
    { value: "oldest", label: "Oldest To Newest" },
  ];

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading quotes...</p>
      </div>
    );
  }

  if (isError) {
    // Handle different error types based on API spec
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorWithStatus = error as {
      status?: number;
      response?: { status?: number };
    };
    const errorStatus =
      errorWithStatus?.status || errorWithStatus?.response?.status;
    const isUnauthorized =
      errorStatus === 401 ||
      errorMessage.includes("401") ||
      errorMessage.includes("Unauthorized");
    const isForbidden =
      errorStatus === 403 ||
      errorMessage.includes("403") ||
      errorMessage.includes("Forbidden");
    const isValidationError =
      errorStatus === 400 ||
      errorMessage.includes("400") ||
      errorMessage.includes("Validation");
    const isServerError =
      errorStatus === 500 ||
      errorMessage.includes("500") ||
      errorMessage.includes("Internal");

    if (isUnauthorized) {
      // Redirect to login on 401
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-red-500">Please login to view your quotes</p>
        </div>
      );
    }

    if (isForbidden) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-red-500">
            You don&apos;t have permission to access this page
          </p>
        </div>
      );
    }

    if (isValidationError) {
      return (
        <div className="min-h-screen flex items-center justify-center flex-col gap-4">
          <p className="text-red-500">Invalid page or limit value.</p>
          <button
            onClick={() => {
              setCurrentPage(1);
              window.location.reload();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reset to Default
          </button>
        </div>
      );
    }

    if (isServerError) {
      return (
        <div className="min-h-screen flex items-center justify-center flex-col gap-4">
          <p className="text-red-500">
            Something went wrong. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-red-500">
          Failed to fetch quotes. Please try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  // Calculate pagination values based on filtered data
  const totalEntries = totalFilteredItems;
  const totalPages = totalPagesForFiltered;
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Quotes</h1>

      <div className="flex items-center justify-between mb-6">
        <Search
          placeholder="SEARCH"
          onSearch={handleSearch}
          variant="primary"
        />
        <SortDropdown
          options={sortOptionsDropdown}
          value={internalSort}
          onChange={handleSortChange}
          showLabel={true}
          labelText="Sort:"
        />
      </div>

      <div className="space-y-2">
        {!filteredData || filteredData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No quotes available</p>
          </div>
        ) : (
          paginatedData.map((quote) => {
            const notificationStatus = quotePaymentStatusMap.get(quote.id);
            const isPaidFromNotification = notificationStatus === "SUCCESS";

            // Check Payment array for SUCCESS status
            const hasPaymentSuccess =
              quote.Payment &&
              Array.isArray(quote.Payment) &&
              quote.Payment.some((p) => p.status === "SUCCESS");

            const enhancedQuote = {
              ...quote,
              paymentStatus: isPaidFromNotification
                ? "SUCCESS"
                : hasPaymentSuccess
                  ? "SUCCESS"
                  : quote.paymentStatus,
              isPaid:
                isPaidFromNotification || hasPaymentSuccess || quote.isPaid,
            };

            return (
              <QuoteCard
                key={quote.id}
                quote={enhancedQuote}
                isCreatingCheckout={isCreatingCheckout}
                processingQuoteId={processingQuoteId}
                onStripePayment={handleStripePayment}
                onManualPayment={handleManualPayment}
                getQuoteStatusDisplay={(status, paymentStatus, isPaid) =>
                  getQuoteStatusDisplay(
                    status,
                    paymentStatus,
                    isPaid,
                    quote.Payment,
                  )
                }
              />
            );
          })
        )}
      </div>

      {/* Only show pagination if there are enough items to paginate */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalEntries={totalEntries}
          entriesPerPage={entriesPerPage}
          onPageChange={handlePageChange}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          itemLabel="quotes"
        />
      )}

      {selectedQuote && (
        <PayNowModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedQuote(null);
          }}
          quote={selectedQuote}
          price={selectedQuote.amount || 0}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default Quotes;
