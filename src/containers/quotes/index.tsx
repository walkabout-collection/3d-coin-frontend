"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Quote } from "./types";
import Search from "@/src/components/common/search";
import SortDropdown from "@/src/components/common/SortDropdown";
import { Eye } from "lucide-react";
import { useUserQuotes, useCreateStripeCheckout } from "@/src/hooks/useQueries";
import Button from "@/src/components/common/button/Button";
import PayNowModal from "@/src/components/PayNowModal";
import { toast } from "react-toastify";

const Quotes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [internalSort, setInternalSort] = useState("newest");
  const [sortedDataState, setSortedDataState] = useState<Quote[] | null>();
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const { data: quotesData, isPending, isError, refetch } = useUserQuotes();
  const { mutate: createStripeCheckout, isPending: isCreatingCheckout } =
    useCreateStripeCheckout({
      onSuccess: (data) => {
        if (data.success && data.data.url) {
          window.location.href = data.data.url; // Redirect to Stripe checkout
        }
      },
      onError: (error) => {
        console.error("Error creating Stripe checkout:", error);
        toast.error("Failed to create payment session. Please try again.");
      },
    });

  useEffect(() => {
    setSortedDataState(quotesData ?? []);
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
          return a.orderId!.localeCompare(b.orderId!);
        case "order_desc":
          return b.orderId!.localeCompare(a.orderId!);
        default:
          return 0;
      }
    });
  };

  useEffect(() => {
    if (quotesData) {
      setSortedDataState(sortData(quotesData, internalSort));
    }
  }, [internalSort, quotesData]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return sortedDataState;

    return sortedDataState?.filter((row) =>
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

  const viewQuote = (id: string) => {
    console.log(`Viewing quote ${id}`);
  };

  const handleStripePayment = (quote: Quote) => {
    if (!quote.amount) {
      toast.error("Quote amount is missing. Please contact support.");
      return;
    }
    createStripeCheckout({
      quoteId: quote.id,
      currency: "usd",
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

  const getQuoteStatusDisplay = (status: string) => {
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
        {filteredData?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No quotes found</p>
          </div>
        ) : (
          filteredData?.map((quote) => (
            <div
              key={quote.id}
              className="bg-gray-100 p-6 rounded-lg flex justify-between items-center"
            >
              <div className="flex-1">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-md font-bold text-black">Name:</span>
                    <span className="text-sm text-gray-900">
                      {quote.user?.firstName + " " + quote.user?.lastName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-md font-bold text-black">
                      Order No:
                    </span>
                    <span className="text-sm text-gray-900">
                      {quote.orderId ? (
                        quote.orderId
                      ) : (
                        <span className="text-gray-500 italic">
                          Pending Order Number
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-md font-bold text-black">Email:</span>
                    <span className="text-sm text-gray-900">
                      {quote.email ?? quote.user?.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-md font-bold text-black">
                      Amount:
                    </span>
                    <span className="text-sm text-gray-900">
                      {quote.amount ? `$${quote.amount.toFixed(2)}` : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-md font-bold text-black">
                      Status:
                    </span>
                    <span
                      className={`text-sm px-2 py-1 rounded ${getQuoteStatusDisplay(quote.status).color}`}
                    >
                      {getQuoteStatusDisplay(quote.status).text}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => viewQuote(quote.id)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                  title="View Quote"
                >
                  <Eye size={22} />
                </button>
                {quote.status === "APPROVED" && quote.amount && (
                  <div className="flex flex-col gap-2 mt-2">
                    {quote.method === "STRIPE" && (
                      <Button
                        variant="primary"
                        onClick={() => handleStripePayment(quote)}
                        disabled={isCreatingCheckout}
                        className="text-xs px-3 py-1 rounded-full max-w-[140px]"
                      >
                        {isCreatingCheckout
                          ? "Processing..."
                          : "Pay with Credit Card"}
                      </Button>
                    )}
                    {quote.method === "MANUAL" && (
                      <Button
                        variant="primary"
                        onClick={() => handleManualPayment(quote)}
                        className="text-xs px-3 py-1 rounded-full max-w-[140px]"
                      >
                        Upload Payment Proof
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
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
