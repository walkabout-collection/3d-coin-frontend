"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useUserDrafts, useSubmitDraft } from "@/src/hooks/useQueries";
import DraftCard from "@/src/components/DraftCard";
import Button from "@/src/components/common/button/Button";
import { Loader2, Plus, FileText, AlertCircle } from "lucide-react";
import PaymentModal from "@/src/components/PaymentMethodModal.tsx";
import { PaymentOption } from "@/src/containers/payment-method/types";

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const DraftsPage: React.FC = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null);

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

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      toast.error("Please log in to view your drafts");
      router.push("/auth/login");
    }
  }, [isLoggedIn, isLoading, router]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading drafts...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Error Loading Drafts
              </h3>
              <p className="text-sm text-red-700 mb-4">
                {error instanceof Error
                  ? error.message
                  : "Failed to load drafts. Please try again."}
              </p>
              <Button
                variant="primary"
                onClick={() => refetch()}
                className="text-sm px-4 py-2"
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Drafts</h1>
            <p className="text-gray-600">
              Continue editing or submit your saved designs
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => router.push("/")}
            className="flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            New Design
          </Button>
        </div>

        {/* Drafts List */}
        {draftsList.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No drafts found
            </h3>
            <p className="text-gray-600 mb-6">
              You haven&apos;t saved any drafts yet. Start creating a design to
              save it as a draft.
            </p>
            <Button variant="primary" onClick={() => router.push("/")}>
              Create New Design
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {draftsList.map((draft) => (
              <DraftCard
                key={draft.id}
                draft={draft}
                onEdit={handleEdit}
                onDelete={() => refetch()}
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
