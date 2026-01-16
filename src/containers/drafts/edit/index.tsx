"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useDraft } from "@/src/hooks/useQueries";
import { Loader2, AlertCircle } from "lucide-react";
import { useStandardBuilderStore } from "@/src/store/useStandardBuilderStore";
import { useCoinDesignStore } from "@/src/store/useCoinStore";
import { getS3RetrieveUrl } from "@/src/services/apiServices";

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

  /**
   * Validates and normalizes image URLs from the Draft API.
   *
   * According to backend documentation:
   * - Backend returns presigned URLs (https://...) or Data URLs (data:image/...)
   * - URLs are ready to use directly in <img> tags
   * - Presigned URLs expire after 1 hour
   * - All fields can be null/empty
   *
   * @param imageUrl - Image URL from API (presigned URL, data URL, or null)
   * @returns Validated URL or undefined if invalid/empty
   */
  const normalizeImageUrl = (
    imageUrl: string | null | undefined,
  ): string | undefined => {
    // Handle null/empty values (documented behavior)
    if (!imageUrl || !imageUrl.trim()) {
      return undefined;
    }

    const trimmedUrl = imageUrl.trim();

    // Backend returns presigned URLs (https://) or Data URLs (data:)
    // Both are ready to use directly
    if (
      trimmedUrl.startsWith("http://") ||
      trimmedUrl.startsWith("https://") ||
      trimmedUrl.startsWith("data:")
    ) {
      return trimmedUrl;
    }

    // Local paths (shouldn't come from API, but handle gracefully)
    if (trimmedUrl.startsWith("/")) {
      return trimmedUrl;
    }

    // Fallback: If it looks like an S3 key (no protocol), convert to presigned URL
    // This should rarely happen if backend is working correctly
    console.warn(
      "[DraftEdit] Unexpected image format (not presigned URL or data URL), might be S3 key:",
      trimmedUrl.substring(0, 50),
    );
    return trimmedUrl; // Return as-is, will be converted below if needed
  };

  /**
   * Converts S3 key to presigned URL (fallback only).
   * Backend should already return presigned URLs, but this handles edge cases.
   */
  const convertS3KeyToPresignedUrl = async (
    imageUrl: string | null | undefined,
  ): Promise<string | undefined> => {
    const normalized = normalizeImageUrl(imageUrl);
    if (!normalized) {
      return undefined;
    }

    // If already a valid URL (presigned, data, or local), use directly
    if (
      normalized.startsWith("http://") ||
      normalized.startsWith("https://") ||
      normalized.startsWith("data:") ||
      normalized.startsWith("/")
    ) {
      return normalized;
    }

    // Fallback: Convert S3 key to presigned URL
    // This should rarely happen if backend is working correctly
    try {
      console.warn(
        "[DraftEdit] Converting S3 key to presigned URL (unexpected):",
        normalized.substring(0, 50),
      );
      const response = await getS3RetrieveUrl(normalized);
      if (response.url) {
        console.log(
          "[DraftEdit] Presigned URL obtained:",
          response.url.substring(0, 80),
        );
        return response.url;
      } else {
        console.warn(
          "[DraftEdit] No presigned URL in response for:",
          normalized.substring(0, 50),
        );
        return undefined;
      }
    } catch (error) {
      console.error(
        "[DraftEdit] Error converting S3 key to presigned URL:",
        error,
      );
      return undefined;
    }
  };

  // Load draft data and navigate to appropriate page
  useEffect(() => {
    if (!draft || isDraftLoading) return;

    const loadDraftAndNavigate = async () => {
      try {
        setIsLoading(true);

        // Log full draft response for debugging
        console.log("[DraftEdit] Full draft response:", {
          id: draft.id,
          builderType: draft.builderType,
          frontImage: draft.frontImage,
          backImage: draft.backImage,
          generatorImage: draft.generatorImage,
          frontDescription: draft.frontDescription,
          backDescription: draft.backDescription,
          generatorPrompt: draft.generatorPrompt,
          coinShape: draft.coinShape,
          materialFinish: draft.materialFinish,
          frontText: draft.frontText,
          backText: draft.backText,
        });

        // Determine if it's AI Generator or Standard Builder
        // Prioritize builderType field if available, otherwise fallback to inference
        // Handle null, undefined, or missing builderType for backward compatibility
        const builderType = draft.builderType || null;
        const isAIGenerator =
          builderType === "AI Generator" ||
          (builderType === null &&
            !!(draft.generatorPrompt || draft.generatorImage));

        // Log for debugging
        console.log(
          "[DraftEdit] builderType:",
          builderType,
          "isAIGenerator:",
          isAIGenerator,
        );
        console.log(
          "[DraftEdit] Image URLs from API (backend returns presigned URLs or data URLs):",
          {
            hasFrontImage: !!draft.frontImage,
            hasBackImage: !!draft.backImage,
            hasGeneratorImage: !!draft.generatorImage,
            frontImageType: draft.frontImage?.startsWith("https://")
              ? "presigned"
              : draft.frontImage?.startsWith("data:")
                ? "data"
                : "unknown",
            backImageType: draft.backImage?.startsWith("https://")
              ? "presigned"
              : draft.backImage?.startsWith("data:")
                ? "data"
                : "unknown",
            generatorImageType: draft.generatorImage?.startsWith("https://")
              ? "presigned"
              : draft.generatorImage?.startsWith("data:")
                ? "data"
                : draft.generatorImage?.startsWith("http://")
                  ? "http"
                  : "unknown",
            frontImagePreview: draft.frontImage?.substring(0, 80),
            backImagePreview: draft.backImage?.substring(0, 80),
            generatorImagePreview: draft.generatorImage?.substring(0, 80),
          },
        );

        // Backend returns presigned URLs (https://) or Data URLs (data:)
        // Both are ready to use directly, but convert S3 keys if detected (fallback)
        const [frontImageUrl, backImageUrl, generatorImageUrl] =
          await Promise.all([
            convertS3KeyToPresignedUrl(draft.frontImage),
            convertS3KeyToPresignedUrl(draft.backImage),
            convertS3KeyToPresignedUrl(draft.generatorImage),
          ]);

        console.log("[DraftEdit] Final image URLs (ready for display):", {
          hasFrontImage: !!frontImageUrl,
          hasBackImage: !!backImageUrl,
          hasGeneratorImage: !!generatorImageUrl,
          frontImagePreview: frontImageUrl?.substring(0, 80),
          backImagePreview: backImageUrl?.substring(0, 80),
          generatorImagePreview: generatorImageUrl?.substring(0, 80),
        });

        if (isAIGenerator) {
          // Load into AI Generator store with all available data
          // Handle missing fields gracefully
          const aiDraftData = {
            generatorPrompt: draft.generatorPrompt || undefined,
            generatorImage: generatorImageUrl,
            frontDescription: draft.frontDescription || undefined,
            frontImage: frontImageUrl,
            backDescription: draft.backDescription || undefined,
            backImage: backImageUrl,
          };

          console.log("[DraftEdit] Loading AI Generator draft data:", {
            hasFrontImage: !!aiDraftData.frontImage,
            hasBackImage: !!aiDraftData.backImage,
            frontImagePreview: aiDraftData.frontImage?.substring(0, 50),
            backImagePreview: aiDraftData.backImage?.substring(0, 50),
          });

          loadAIGeneratorData(aiDraftData);
          setAIGeneratorDraftId(draftId);

          // Navigate to AI Generator
          router.push("/custom-shapes");
        } else {
          // Load into Standard Builder store with all available data
          // Pass all fields including packaging if available
          const sbDraftData = {
            coinShape: draft.coinShape || undefined,
            materialFinish: draft.materialFinish || undefined,
            frontDescription: draft.frontDescription || undefined,
            frontImage: frontImageUrl,
            frontText: draft.frontText || undefined,
            backDescription: draft.backDescription || undefined,
            backImage: backImageUrl,
            backText: draft.backText || undefined,
            generatorPrompt: draft.generatorPrompt || undefined,
            generatorImage: generatorImageUrl,
            // Note: Packaging data might be in a nested structure or separate field
            // If the API provides packaging.description and packaging.text, they would be here
            // For now, we handle what's available in the flat structure
          };

          console.log("[DraftEdit] Loading Standard Builder draft data:", {
            hasFrontImage: !!sbDraftData.frontImage,
            hasBackImage: !!sbDraftData.backImage,
            frontImagePreview: sbDraftData.frontImage?.substring(0, 50),
            backImagePreview: sbDraftData.backImage?.substring(0, 50),
          });

          loadStandardBuilderData(sbDraftData);
          setStandardBuilderDraftId(draftId);

          // Navigate to Standard Builder - start from dimensions
          // The user can navigate through steps to see all prefilled data
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
