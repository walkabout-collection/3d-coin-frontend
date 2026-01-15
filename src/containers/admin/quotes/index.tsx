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
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 8; // Quotes per page

  const {
    data: quotesData,
    isLoading,
    isError,
    refetch,
  } = useAdminQuotes({
    page: currentPage,
    limit: entriesPerPage,
  });

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

  // Extract quotes array and pagination info from response
  const quotesArray: Quote[] = useMemo(() => {
    if (!quotesData) return [];

    let quotes: Quote[] = [];
    if (quotesData.data && Array.isArray(quotesData.data)) {
      quotes = quotesData.data as Quote[];
    } else if (Array.isArray(quotesData)) {
      quotes = quotesData as Quote[];
    }

    // Filter out quotes with designStatus: "DRAFT"
    return quotes.filter(
      (quote) => quote.designStatus?.toUpperCase() !== "DRAFT",
    );
  }, [quotesData]);

  // Extract pagination info
  const pagination = useMemo(() => {
    if (!quotesData || !quotesData.pagination) {
      return null;
    }
    return quotesData.pagination;
  }, [quotesData]);

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
    if (quotesArray?.length) {
      const nonApprovedQuotes = quotesArray.filter(
        (quote) => quote.status?.toUpperCase() !== "APPROVED",
      );
      setSortedDataState(sortData(nonApprovedQuotes, internalSort));
    } else {
      setSortedDataState([]);
    }
  }, [quotesArray, internalSort]);

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
    if (pagination && page > pagination.totalPages) return;

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Force refetch on page change
  useEffect(() => {
    refetch();
    setSortedDataState([]);
  }, [currentPage, refetch]);

  // Get page numbers for pagination
  const getPageNumbers = () => {
    if (!pagination) return [];
    const totalPages = pagination.totalPages;
    const currentPageNum = currentPage;
    const maxPagesToShow = 5;
    const pageNumbers: number[] = [];

    let startPage = Math.max(
      1,
      currentPageNum - Math.floor(maxPagesToShow / 2),
    );
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

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
      deleteQuote(id);
    }
  };

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

  const pendingQuotesCount = useMemo(() => {
    if (!quotesArray?.length) return 0;
    return quotesArray.filter(
      (quote) => quote.status?.toUpperCase() === "PENDING",
    ).length;
  }, [quotesArray]);

  const approveQuotesCount = useMemo(() => {
    if (!quotesArray?.length) return 0;
    // Filter out APPROVED quotes (quotesArray already excludes DRAFT)
    return quotesArray.filter(
      (quote) => quote.status?.toUpperCase() !== "APPROVED",
    ).length;
  }, [quotesArray]);

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

      {/* Pagination - Matching Orders Page Style */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 mb-10">
          <div className="text-sm text-gray-500">
            Showing{" "}
            {(currentPage - 1) * (pagination.limit || entriesPerPage) + 1} to{" "}
            {Math.min(
              currentPage * (pagination.limit || entriesPerPage),
              pagination.total,
            )}{" "}
            of {pagination.total} entries
          </div>

          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.hasPreviousPage || isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                disabled={isLoading}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  pageNumber === currentPage
                    ? "bg-[#1a2a3a] text-white"
                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {pageNumber}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.hasNextPage || isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuotes;
