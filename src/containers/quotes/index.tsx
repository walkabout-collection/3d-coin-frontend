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

const Quotes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [internalSort, setInternalSort] = useState("newest");
  const [sortedDataState, setSortedDataState] = useState<Quote[] | null>();
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const { data: quotesData, isPending, isError, refetch } = useUserQuotes();
  const { data: paymentNotificationsData } = usePaymentNotifications();
  const [processingQuoteId, setProcessingQuoteId] = useState<string | null>(
    null,
  );

  // Create a map of quoteId -> payment status from notifications
  const quotePaymentStatusMap = useMemo(() => {
    const map = new Map<string, "SUCCESS" | "PENDING" | "FAILED">();

    if (
      paymentNotificationsData?.success &&
      paymentNotificationsData.data?.notifications
    ) {
      const notifications = paymentNotificationsData.data.notifications;

      // Process notifications and keep the latest status for each quoteId
      notifications.forEach((notification) => {
        if (notification.quoteId && notification.status) {
          // Only update if this notification is newer or if we don't have a status yet
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
          // Clear idempotency key on successful checkout creation
          clearIdempotencyKey(variables.quoteId);
          setProcessingQuoteId(null);
          window.location.href = data.data.url; // Redirect to Stripe checkout
        }
      },
      onError: (error) => {
        setProcessingQuoteId(null);
        const msg = error instanceof Error ? error.message : String(error);

        // Enhanced error handling
        if (msg.includes("already completed") || msg.includes("already paid")) {
          toast.info("This quote has already been paid.");
          refetch();
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

  // Extract quotes array from response
  const quotesArray: Quote[] = useMemo(() => {
    if (!quotesData) return [];

    // Handle both array and paginated response
    if (Array.isArray(quotesData)) {
      return quotesData as Quote[];
    }

    // If it's an object with data property
    if (quotesData.data && Array.isArray(quotesData.data)) {
      return quotesData.data as Quote[];
    }

    return [];
  }, [quotesData]);

  useEffect(() => {
    setSortedDataState(quotesArray);
  }, [quotesArray]);

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

  useEffect(() => {
    if (quotesArray.length > 0) {
      setSortedDataState(sortData(quotesArray, internalSort));
    } else {
      setSortedDataState([]);
    }
  }, [internalSort, quotesArray]);

  const filteredData = useMemo(() => {
    // Ensure we always return an array
    const dataToFilter = sortedDataState || [];

    if (!searchTerm) return dataToFilter;

    return dataToFilter.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  }, [sortedDataState, searchTerm]);

  const handleSortChange = (sort: string) => {
    setInternalSort(sort);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleStripePayment = (quote: Quote) => {
    // Prevent duplicate submissions
    if (processingQuoteId === quote.id || isCreatingCheckout) {
      toast.warning("Payment is already being processed. Please wait.");
      return;
    }

    if (!quote.amount) {
      toast.error("Quote amount is missing. Please contact support.");
      return;
    }

    // Set processing state
    setProcessingQuoteId(quote.id);

    // Generate or get existing idempotency key
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
    refetch();
  };

  const getQuoteStatusDisplay = (
    status: string,
    paymentStatus?: string,
    isPaid?: boolean,
  ) => {
    // If payment is successful, show paid status
    if (isPaid || paymentStatus === "PAID" || paymentStatus === "SUCCESS") {
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
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

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

      <div className="space-y-4">
        {!filteredData || filteredData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No quotes found</p>
          </div>
        ) : (
          filteredData.map((quote) => {
            // Check payment status from notifications
            const notificationStatus = quotePaymentStatusMap.get(quote.id);
            const isPaidFromNotification = notificationStatus === "SUCCESS";

            // Enhanced quote with payment status from notifications
            const enhancedQuote = {
              ...quote,
              // Override paymentStatus if we have a SUCCESS notification
              paymentStatus: isPaidFromNotification
                ? "SUCCESS"
                : quote.paymentStatus,
              // Override isPaid if we have a SUCCESS notification
              isPaid: isPaidFromNotification || quote.isPaid,
            };

            return (
              <QuoteCard
                key={quote.id}
                quote={enhancedQuote}
                isCreatingCheckout={isCreatingCheckout}
                processingQuoteId={processingQuoteId}
                onStripePayment={handleStripePayment}
                onManualPayment={handleManualPayment}
                getQuoteStatusDisplay={getQuoteStatusDisplay}
              />
            );
          })
        )}
      </div>
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
