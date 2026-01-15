"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useDraft } from "@/src/hooks/useQueries";
import Button from "@/src/components/common/button/Button";
import {
  Loader2,
  ArrowLeft,
  Edit2,
  AlertCircle,
  FileText,
  Calendar,
  Clock,
} from "lucide-react";

interface DraftDetailPageProps {
  draftId: string;
}

const DraftDetailPage: React.FC<DraftDetailPageProps> = ({ draftId }) => {
  const router = useRouter();

  const { data: draft, isLoading, isError, error } = useDraft(draftId);

  // Note: Authentication is handled by middleware

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Unknown";
    }
  };

  if (isLoading) {
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
              <Button
                variant="primary"
                onClick={() => router.push("/drafts")}
                className="text-sm px-4 py-2"
              >
                Back to Drafts
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
        <div className="mb-6">
          <Button
            variant="ternary"
            onClick={() => router.push("/drafts")}
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Drafts
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {draft.name || "Untitled Draft"}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Created: {formatDate(draft.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Last updated: {formatDate(draft.updatedAt)}</span>
                </div>
              </div>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
              DRAFT
            </span>
          </div>
        </div>

        {/* Design Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Design Details
          </h2>

          {/* Images Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Front Image */}
            {draft.frontImage && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-800 uppercase tracking-wide">
                  Front Design
                </h3>
                <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                  <Image
                    src={draft.frontImage}
                    alt="Front design"
                    fill
                    className="object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/images/home/front-side.png";
                    }}
                  />
                </div>
                {draft.frontDescription && (
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="font-medium">Description:</span>{" "}
                    {draft.frontDescription}
                  </p>
                )}
                {draft.frontText && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Text:</span> {draft.frontText}
                  </p>
                )}
                {draft.frontTextStyle && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Text Style:</span>{" "}
                    {draft.frontTextStyle}
                  </p>
                )}
              </div>
            )}

            {/* Back Image */}
            {draft.backImage && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-800 uppercase tracking-wide">
                  Back Design
                </h3>
                <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                  <Image
                    src={draft.backImage}
                    alt="Back design"
                    fill
                    className="object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/images/home/back-side.png";
                    }}
                  />
                </div>
                {draft.backDescription && (
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="font-medium">Description:</span>{" "}
                    {draft.backDescription}
                  </p>
                )}
                {draft.backText && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Text:</span> {draft.backText}
                  </p>
                )}
                {draft.backTextStyle && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Text Style:</span>{" "}
                    {draft.backTextStyle}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Generator Image (if AI generated) */}
          {(draft.generatorImage || draft.generatorPrompt) && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 uppercase tracking-wide mb-3">
                AI Generator
              </h3>
              {draft.generatorImage && (
                <div className="relative w-full max-w-md h-64 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center mb-3">
                  <Image
                    src={draft.generatorImage}
                    alt="Generator image"
                    fill
                    className="object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/images/home/coin-design.png";
                    }}
                  />
                </div>
              )}
              {draft.generatorPrompt && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Prompt:</span>{" "}
                  {draft.generatorPrompt}
                </p>
              )}
            </div>
          )}

          {/* Specifications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {draft.coinShape && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Coin Shape
                </h4>
                <p className="text-gray-900">{draft.coinShape}</p>
              </div>
            )}
            {draft.materialFinish && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Material & Finish
                </h4>
                <p className="text-gray-900">{draft.materialFinish}</p>
              </div>
            )}
            {draft.subject && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Subject
                </h4>
                <p className="text-gray-900">{draft.subject}</p>
              </div>
            )}
            {draft.contrastStyle && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Contrast Style
                </h4>
                <p className="text-gray-900">{draft.contrastStyle}</p>
              </div>
            )}
            {draft.detailLevel && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Detail Level
                </h4>
                <p className="text-gray-900">{draft.detailLevel}</p>
              </div>
            )}
            {draft.totalCoins && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Total Coins
                </h4>
                <p className="text-gray-900">{draft.totalCoins}</p>
              </div>
            )}
          </div>

          {/* Additional Details */}
          {(draft.frontReference ||
            draft.frontReferenceImpact ||
            draft.frontComposition ||
            draft.backReference ||
            draft.backReferenceImpact ||
            draft.backComposition ||
            draft.designerInstructions ||
            draft.prohibitedContent) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 uppercase tracking-wide">
                Additional Details
              </h3>

              {draft.frontReference && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 mb-1">
                    Front Reference
                  </h4>
                  <p className="text-sm text-gray-700">
                    {draft.frontReference}
                  </p>
                </div>
              )}

              {draft.frontReferenceImpact && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 mb-1">
                    Front Reference Impact
                  </h4>
                  <p className="text-sm text-gray-700">
                    {draft.frontReferenceImpact}
                  </p>
                </div>
              )}

              {draft.frontComposition && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 mb-1">
                    Front Composition
                  </h4>
                  <p className="text-sm text-gray-700">
                    {draft.frontComposition}
                  </p>
                </div>
              )}

              {draft.backReference && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 mb-1">
                    Back Reference
                  </h4>
                  <p className="text-sm text-gray-700">{draft.backReference}</p>
                </div>
              )}

              {draft.backReferenceImpact && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 mb-1">
                    Back Reference Impact
                  </h4>
                  <p className="text-sm text-gray-700">
                    {draft.backReferenceImpact}
                  </p>
                </div>
              )}

              {draft.backComposition && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 mb-1">
                    Back Composition
                  </h4>
                  <p className="text-sm text-gray-700">
                    {draft.backComposition}
                  </p>
                </div>
              )}

              {draft.designerInstructions && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 mb-1">
                    Designer Instructions
                  </h4>
                  <p className="text-sm text-gray-700">
                    {draft.designerInstructions}
                  </p>
                </div>
              )}

              {draft.prohibitedContent && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 mb-1">
                    Prohibited Content
                  </h4>
                  <p className="text-sm text-gray-700">
                    {draft.prohibitedContent}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <Button
            variant="ternary"
            onClick={() => router.push(`/drafts/${draftId}/edit`)}
            className="flex items-center gap-2"
          >
            <Edit2 className="h-4 w-4" />
            Edit Draft
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DraftDetailPage;
