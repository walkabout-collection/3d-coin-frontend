"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Quote } from "./types";
import Search from "@/src/components/common/search";
import SortDropdown from "@/src/components/common/SortDropdown";
import Image from "next/image";
import Button from "@/src/components/common/button/Button";
import AddQuoteModal from "@/src/components/admin/AddQuoteModal";
import ApproveQuoteModal from "@/src/components/admin/ApproveQuoteModal";
import { useAdminQuotes, useDeleteAdminQuote } from "@/src/hooks/useQueries";
import { quotesCards } from "./data";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import ViewQuoteModal from "@/src/components/admin/ViewQuoteModal/ViewQuoteModal";

const AdminQuotes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [internalSort, setInternalSort] = useState("newest");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [viewQuoteId, setViewQuoteId] = useState<string | null>(null);

  const {
    data: quotesData = [],
    isLoading,
    isError,
    refetch,
  } = useAdminQuotes();

  const viewQuote = (id: string) => {
    setViewQuoteId(id);
  };

  const { mutate: deleteQuote, isPending: isDeleting } = useDeleteAdminQuote({
    onSuccess: () => {
      toast.success("Quote deleted successfully");
      refetch();
    },
    onError: (error: unknown) => {
      const err = error as AxiosError<{ message?: string }>;
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to delete quote";
      toast.error(errorMessage);
    },
  });

  const sortData = (dataToSort: Quote[], sortValue: string) => {
    if (!sortValue || !dataToSort.length) return dataToSort;
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
        default:
          return 0;
      }
    });
  };

  const [sortedDataState, setSortedDataState] = useState<Quote[]>([]);
  useEffect(() => {
    if (quotesData?.length) {
      const nonApprovedQuotes = (quotesData as Quote[]).filter(
        (quote) => quote.status?.toUpperCase() !== "APPROVED",
      );
      setSortedDataState(sortData(nonApprovedQuotes, internalSort));
    } else {
      setSortedDataState([]);
    }
  }, [quotesData, internalSort]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return sortedDataState;
    return sortedDataState.filter((row) => {
      const searchableFields = [
        row.user?.firstName,
        row.user?.lastName,
        row.user?.email,
        row.email,
        row.orderId,
        row.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return searchableFields.includes(searchTerm.toLowerCase());
    });
  }, [sortedDataState, searchTerm]);

  const handleSortChange = (sort: string) => setInternalSort(sort);
  const handleSearch = (term: string) => setSearchTerm(term);

  const handleApprove = (id: string) => {
    const quote = filteredData.find((q) => q.id === id);
    if (quote) {
      setSelectedQuote(quote);
      setIsApproveModalOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    const quote = filteredData.find((q) => q.id === id);
    if (quote) {
      // Check if quote can be deleted (client-side validation)
      if (quote.status === "APPROVED") {
        toast.error(
          "Approved quote cannot be deleted. It has been converted to an order.",
        );
        return;
      }
      if (quote.orderId) {
        toast.error("Quote cannot be deleted. It is linked to an order.");
        return;
      }
      // Proceed with deletion
      deleteQuote(id);
    }
  };

  // Check if quote can be deleted
  const canDeleteQuote = (quote: Quote): boolean => {
    return quote.status !== "APPROVED" && !quote.orderId;
  };

  const handleApproveClose = () => {
    setIsApproveModalOpen(false);
    setSelectedQuote(null);
  };

  const handleApproveConfirm = (price: number) => {
    if (selectedQuote) {
      console.log(
        `Approved quote ${selectedQuote.id} with total price ${price}`,
      );
      setSortedDataState((prev) =>
        prev.map((q) =>
          q.id === selectedQuote.id ? { ...q, label: "Approved" } : q,
        ),
      );
    }
    handleApproveClose();
  };

  const sortOptionsDropdown = [
    { value: "newest", label: "Newest To Oldest" },
    { value: "oldest", label: "Oldest To Newest" },
  ];

  // Calculate dynamic counts (excluding APPROVED quotes)
  const pendingQuotesCount = useMemo(() => {
    if (!quotesData?.length) return 0;
    return (quotesData as Quote[]).filter(
      (quote) => quote.status?.toUpperCase() === "PENDING",
    ).length;
  }, [quotesData]);

  const approveQuotesCount = useMemo(() => {
    if (!quotesData?.length) return 0;
    // Count quotes that are not APPROVED (can be approved)
    return (quotesData as Quote[]).filter(
      (quote) => quote.status?.toUpperCase() !== "APPROVED",
    ).length;
  }, [quotesData]);

  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Quotes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <div className="bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#1a2a3a] rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
              <div className="w-6 h-6 relative">
                <Image
                  src={quotesCards[0].icon}
                  alt="Pending Quotes icon"
                  fill
                  className="object-contain filter brightness-0 invert"
                />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
                {quotesCards[0].title}
              </h2>
              <p className="text-2xl font-bold text-gray-900">
                {pendingQuotesCount}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#1a2a3a] rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
              <div className="w-6 h-6 relative">
                <Image
                  src={quotesCards[1].icon}
                  alt="Approve Quotes icon"
                  fill
                  className="object-contain filter brightness-0 invert"
                />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
                {quotesCards[1].title}
              </h2>
              <p className="text-2xl font-bold text-gray-900">
                {approveQuotesCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6 mt-10">
        <Search
          placeholder="SEARCH"
          onSearch={handleSearch}
          variant="primary"
        />
        <div className="flex items-center gap-6">
          <Button
            type="button"
            variant="ternary"
            className="max-w-[140px] rounded-lg text-sm font-semibold !bg-gray-200 border-none"
            onClick={() => setIsModalOpen(true)}
          >
            Add Quote
          </Button>
          <SortDropdown
            options={sortOptionsDropdown}
            value={internalSort}
            onChange={handleSortChange}
            showLabel={true}
            labelText="Sort:"
          />
        </div>
      </div>

      {/* Quotes list */}
      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : isError ? (
        <p className="text-red-500">Failed to load quotes</p>
      ) : filteredData.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No quotes found</p>
        </div>
      ) : (
        filteredData.map((quote) => (
          <div
            key={quote.id}
            className="bg-gray-100 p-6 rounded-lg flex justify-between items-center mb-2"
          >
            <div className="flex-1">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-md font-bold text-black">Name:</span>
                  <span className="text-sm text-gray-900">
                    {quote.user
                      ? `${quote.user.firstName} ${quote.user.lastName}`
                      : "Customer"}
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
                    {" "}
                    {quote.user ? quote.user.email : quote.email}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-6">
              <span className="text-black px-3 py-1 rounded-md text-sm font-semibold bg-gray-200">
                {quote.status}
              </span>
              <div className="flex gap-2">
                <button
                  className={`p-2 text-xs rounded-full bg-gray-200 ${
                    canDeleteQuote(quote)
                      ? "cursor-pointer hover:bg-gray-300"
                      : "cursor-not-allowed opacity-50"
                  }`}
                  onClick={() => handleDelete(quote.id)}
                  disabled={isDeleting || !canDeleteQuote(quote)}
                  title={
                    !canDeleteQuote(quote)
                      ? quote.status === "APPROVED"
                        ? "Approved quotes cannot be deleted"
                        : "Quote linked to an order cannot be deleted"
                      : "Delete quote"
                  }
                >
                  <Image
                    src="/images/dashboard/delete.svg"
                    alt="Delete"
                    width={20}
                    height={20}
                  />
                </button>
                <button
                  onClick={() => viewQuote(quote.id)}
                  className="px-3 py-2 text-xs rounded-full bg-gray-200 cursor-pointer"
                >
                  <Image
                    src="/images/dashboard/view-icon.svg"
                    alt="View"
                    width={20}
                    height={20}
                  />
                </button>
                <Button
                  variant="primary"
                  className="px-3 py-1 text-xs rounded-full max-w-[140px]"
                  onClick={() => handleApprove(quote.id)}
                >
                  Add to Order
                </Button>
              </div>
            </div>
          </div>
        ))
      )}
      {isModalOpen && <AddQuoteModal onClose={() => setIsModalOpen(false)} />}
      {isApproveModalOpen && selectedQuote && (
        <ApproveQuoteModal
          quote={selectedQuote}
          onClose={handleApproveClose}
          onApprove={handleApproveConfirm}
        />
      )}
      {viewQuoteId && (
        <ViewQuoteModal id={viewQuoteId} onClose={() => setViewQuoteId(null)} />
      )}
    </div>
  );
};

export default AdminQuotes;
