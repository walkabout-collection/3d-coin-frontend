"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useDraft } from "@/src/hooks/useQueries";
import { Loader2, AlertCircle } from "lucide-react";
import { useStandardBuilderStore } from "@/src/store/useStandardBuilderStore";
import { useCoinDesignStore } from "@/src/store/useCoinStore";

interface DraftEditPageProps {
  draftId: string;
}

const DraftEditPage: React.FC<DraftEditPageProps> = ({ draftId }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const {
    data: draft,
    isLoading: isDraftLoading,
    isError,
    error,
  } = useDraft(draftId);
  const {
    loadDraftData: loadStandardBuilderData,
    setCurrentDraftId: setStandardBuilderDraftId,
  } = useStandardBuilderStore();
  const {
    loadDraftData: loadAIGeneratorData,
    setCurrentDraftId: setAIGeneratorDraftId,
  } = useCoinDesignStore();

  // Note: Authentication is handled by middleware

  // Load draft data and navigate to appropriate page
  useEffect(() => {
    if (!draft || isDraftLoading) return;

    const loadDraftAndNavigate = async () => {
      try {
        setIsLoading(true);

        // Determine if it's AI Generator or Standard Builder
        const isAIGenerator = !!(draft.generatorPrompt || draft.generatorImage);

        if (isAIGenerator) {
          // Load into AI Generator store
          loadAIGeneratorData({
            generatorPrompt: draft.generatorPrompt,
            generatorImage: draft.generatorImage,
            frontDescription: draft.frontDescription,
            frontImage: draft.frontImage,
            backDescription: draft.backDescription,
            backImage: draft.backImage,
          });
          setAIGeneratorDraftId(draftId);

          // Navigate to AI Generator
          router.push("/custom-shapes");
        } else {
          // Load into Standard Builder store
          // Use the store's loadDraftData method which handles parsing
          loadStandardBuilderData({
            coinShape: draft.coinShape,
            materialFinish: draft.materialFinish,
            frontDescription: draft.frontDescription,
            frontImage: draft.frontImage,
            frontText: draft.frontText,
            backDescription: draft.backDescription,
            backImage: draft.backImage,
            backText: draft.backText,
            generatorPrompt: draft.generatorPrompt,
            generatorImage: draft.generatorImage,
          });
          setStandardBuilderDraftId(draftId);

          // Navigate to Standard Builder - start from dimensions
          router.push("/standard-builder");
        }

        toast.success("Draft loaded successfully!");
      } catch (err) {
        console.error("Error loading draft:", err);
        toast.error("Failed to load draft. Please try again.");
        router.push("/drafts");
      } finally {
        setIsLoading(false);
      }
    };

    loadDraftAndNavigate();
  }, [
    draft,
    draftId,
    isDraftLoading,
    router,
    loadAIGeneratorData,
    loadStandardBuilderData,
    setAIGeneratorDraftId,
    setStandardBuilderDraftId,
  ]);

  if (isDraftLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading draft...</p>
        </div>
      </div>
    );
  }

  if (isError || !draft) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Error Loading Draft
              </h3>
              <p className="text-sm text-red-700 mb-4">
                {error instanceof Error
                  ? error.message
                  : "Failed to load draft. Please try again."}
              </p>
              <button
                onClick={() => router.push("/drafts")}
                className="text-sm px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
              >
                Back to Drafts
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // This should not be reached as we redirect in useEffect
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
};

export default DraftEditPage;
