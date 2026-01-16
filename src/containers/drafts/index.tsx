"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useUserDrafts, useSubmitDraft } from "@/src/hooks/useQueries";
import DraftCard from "@/src/components/DraftCard";
import Button from "@/src/components/common/button/Button";
import Search from "@/src/components/common/search";
import SortDropdown from "@/src/components/common/SortDropdown";
import {
  Loader2,
  Plus,
  FileText,
  AlertCircle,
  Search as SearchIcon,
  Filter,
} from "lucide-react";
import PaymentModal from "@/src/components/PaymentMethodModal.tsx";
import { PaymentOption } from "@/src/containers/payment-method/types";
import { DraftDesign } from "@/src/services/apiServices";

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const DraftsPage: React.FC = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  const { data: drafts, isLoading, isError, error, refetch } = useUserDrafts();

  const submitDraftMutation = useSubmitDraft({
    onSuccess: () => {
      toast.success("Draft submitted successfully!");
      setShowPaymentModal(false);
      setSelectedDraftId(null);
      refetch();
      router.push("/");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to submit draft";
      toast.error(errorMessage);
    },
  });

  useEffect(() => {
    const checkAuth = () => {
      const token = getCookie("token");
      setIsLoggedIn(!!token);
    };

    checkAuth();
    window.addEventListener("authChanged", checkAuth);
    return () => {
      window.removeEventListener("authChanged", checkAuth);
    };
  }, []);

  // Note: Authentication is handled by middleware, but we still check for API errors
  // The middleware will redirect to login if not authenticated

  const handleEdit = (draftId: string) => {
    // Load draft and navigate to appropriate page
    router.push(`/drafts/${draftId}/edit`);
  };

  const handlePaymentSelect = (
    option: PaymentOption,
    amountValue: number,
    emailValue?: string,
  ) => {
    // emailValue is available but not needed for draft submission
    void emailValue;

    if (selectedDraftId) {
      submitDraftMutation.mutate({
        draftId: selectedDraftId,
        data: {
          method: option.name.toUpperCase() as
            | "STRIPE"
            | "QUICKBOOKS"
            | "MANUAL",
          amount: amountValue,
        },
      });
    }
  };

  const handleSubmit = (draftId: string) => {
    setSelectedDraftId(draftId);
    setShowPaymentModal(true);
  };

  const handleModalClose = () => {
    setShowPaymentModal(false);
    setSelectedDraftId(null);
  };

  const draftsList = drafts || [];

  // Sort and filter drafts
  const sortedAndFilteredDrafts = useMemo(() => {
    let filtered = draftsList;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((draft) => {
        const searchableText = [
          draft.name,
          draft.generatorPrompt,
          draft.frontText,
          draft.backText,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return searchableText.includes(searchTerm.toLowerCase());
      });
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          );
        case "name_asc":
          return (a.name || "").localeCompare(b.name || "");
        case "name_desc":
          return (b.name || "").localeCompare(a.name || "");
        default:
          return 0;
      }
    });

    return sorted;
  }, [draftsList, searchTerm, sortOption]);

  // Show loading while loading drafts
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#1a2a3a]" />
          <p className="text-gray-600 font-medium">Loading drafts...</p>
        </div>
      </div>
    );
  }

  // Handle API errors
  if (isError) {
    // Check if it's an authentication error
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

    if (isUnauthorized) {
      // Middleware should handle this, but show a message just in case
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
          <div className="max-w-md w-full bg-white border border-gray-200 rounded-lg p-8 text-center shadow-sm">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Authentication Required
            </h3>
            <p className="text-gray-600 mb-6">
              Please log in to view your drafts
            </p>
            <Button
              variant="primary"
              onClick={() => router.push("/login")}
              width="w-auto"
              className="mx-auto"
            >
              Go to Login
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
        <div className="max-w-md w-full bg-white border border-red-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Error Loading Drafts
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {error instanceof Error
                  ? error.message
                  : "Failed to load drafts. Please try again."}
              </p>
              <Button
                variant="primary"
                onClick={() => refetch()}
                width="w-auto"
                className="text-sm"
              >
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                My Drafts
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                Continue editing or submit your saved designs
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => router.push("/standard-builder")}
              className="flex items-center gap-2 w-full sm:w-auto shadow-md hover:shadow-lg transition-shadow"
              width="w-full sm:w-auto"
            >
              <Plus className="h-5 w-5" />
              New Design
            </Button>
          </div>

          {/* Search and Filter Bar */}
          {draftsList.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Search
                  placeholder="Search drafts by name or description..."
                  onSearch={setSearchTerm}
                  value={searchTerm}
                />
              </div>
              <div className="w-full sm:w-64">
                <SortDropdown
                  options={[
                    { value: "newest", label: "Newest First" },
                    { value: "oldest", label: "Oldest First" },
                    { value: "name_asc", label: "Name (A-Z)" },
                    { value: "name_desc", label: "Name (Z-A)" },
                  ]}
                  value={sortOption}
                  onChange={setSortOption}
                />
              </div>
            </div>
          )}

          {/* Drafts Count and Results Info */}
          {draftsList.length > 0 && (
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-[#1a2a3a] text-white shadow-sm">
                  {draftsList.length}{" "}
                  {draftsList.length === 1 ? "Draft" : "Drafts"}
                </span>
                {searchTerm && (
                  <span className="text-sm text-gray-600">
                    {sortedAndFilteredDrafts.length} result
                    {sortedAndFilteredDrafts.length !== 1 ? "s" : ""} found
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Drafts List */}
        {draftsList.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 md:p-16 text-center shadow-sm">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No drafts found
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto text-base">
              You haven&apos;t saved any drafts yet. Start creating a design to
              save it as a draft.
            </p>
            <Button
              variant="primary"
              onClick={() => router.push("/standard-builder")}
              width="w-auto"
              className="mx-auto shadow-md hover:shadow-lg transition-shadow"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create New Design
            </Button>
          </div>
        ) : sortedAndFilteredDrafts.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 md:p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <SearchIcon className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No drafts match your search
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Button
              variant="ternary"
              onClick={() => {
                setSearchTerm("");
                setSortOption("newest");
              }}
              width="w-auto"
              className="mx-auto"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedAndFilteredDrafts.map((draft) => (
              <DraftCard
                key={draft.id}
                draft={draft}
                onEdit={handleEdit}
                onDelete={() => refetch()}
                onSubmit={handleSubmit}
              />
            ))}
          </div>
        )}

        {/* Payment Modal */}
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={handleModalClose}
          onPaymentSelect={handlePaymentSelect}
        />
      </div>
    </div>
  );
};

export default DraftsPage;
