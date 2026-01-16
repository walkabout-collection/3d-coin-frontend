"use client";
import React, { useMemo, useRef, useState } from "react";
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
  Send,
  Sparkles,
  Image as ImageIcon,
  Settings,
  Info,
} from "lucide-react";

interface DraftDetailPageProps {
  draftId: string;
}

const DraftDetailPage: React.FC<DraftDetailPageProps> = ({ draftId }) => {
  const router = useRouter();
  const frontImageErrorRef = useRef(false);
  const backImageErrorRef = useRef(false);
  const generatorImageErrorRef = useRef(false);

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

  // Validate image URL - must start with /, http://, https://, or data:
  const validateImageUrl = (url: string | null | undefined): string | null => {
    if (!url) return null;
    if (
      url.startsWith("/") ||
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("data:")
    ) {
      return url;
    }
    return null;
  };

  // Memoize image URLs to prevent recalculation on every render
  const frontImageUrl = useMemo(() => {
    if (frontImageErrorRef.current || !draft?.frontImage) {
      return "/images/home/front-side.png";
    }
    return validateImageUrl(draft.frontImage) || "/images/home/front-side.png";
  }, [draft?.frontImage]);

  const backImageUrl = useMemo(() => {
    if (backImageErrorRef.current || !draft?.backImage) {
      return "/images/home/back-side.png";
    }
    return validateImageUrl(draft.backImage) || "/images/home/back-side.png";
  }, [draft?.backImage]);

  const generatorImageUrl = useMemo(() => {
    if (generatorImageErrorRef.current || !draft?.generatorImage) {
      return "/images/home/coin-design.png";
    }
    return (
      validateImageUrl(draft.generatorImage) || "/images/home/coin-design.png"
    );
  }, [draft?.generatorImage]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#1a2a3a]" />
          <p className="text-gray-600 font-medium">Loading draft...</p>
        </div>
      </div>
    );
  }

  if (isError || !draft) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-red-200 rounded-xl p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Error Loading Draft
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                {error instanceof Error
                  ? error.message
                  : "Failed to load draft. Please try again."}
              </p>
              <Button
                variant="primary"
                onClick={() => router.push("/drafts")}
                className="text-sm px-4 py-2 shadow-md"
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ternary"
            onClick={() => router.push("/drafts")}
            className="flex items-center gap-2 mb-6 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Drafts
          </Button>

          {/* Title Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {draft.name || "Untitled Draft"}
                  </h1>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#1a2a3a] text-white shadow-sm">
                    DRAFT
                  </span>
                  {/* Builder Type Badge */}
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide shadow-sm ${
                      (draft.builderType || "Standard Builder") ===
                      "AI Generator"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {draft.builderType || "Standard Builder"}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">Created:</span>
                    <span>{formatDate(draft.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">Updated:</span>
                    <span>{formatDate(draft.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Design Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 mb-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#1a2a3a] rounded-lg flex items-center justify-center">
              <ImageIcon className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Design Details</h2>
          </div>

          {/* Images Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Front Image */}
            {draft.frontImage && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ImageIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Front Design
                  </h3>
                </div>
                <div className="relative w-full h-72 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden flex items-center justify-center border border-gray-200 shadow-sm">
                  {frontImageUrl.startsWith("data:") ? (
                    <img
                      src={frontImageUrl}
                      alt="Front design"
                      className="absolute inset-0 w-full h-full object-contain"
                      onError={() => {
                        if (!frontImageErrorRef.current) {
                          frontImageErrorRef.current = true;
                        }
                      }}
                    />
                  ) : (
                    <Image
                      src={frontImageUrl}
                      alt="Front design"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain"
                      onError={() => {
                        if (!frontImageErrorRef.current) {
                          frontImageErrorRef.current = true;
                        }
                      }}
                    />
                  )}
                </div>
                <div className="space-y-2 bg-gray-50 rounded-lg p-4">
                  {draft.frontDescription && (
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Description
                      </span>
                      <p className="text-sm text-gray-700 mt-1">
                        {draft.frontDescription}
                      </p>
                    </div>
                  )}
                  {draft.frontText && (
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Text
                      </span>
                      <p className="text-sm text-gray-700 mt-1">
                        {draft.frontText}
                      </p>
                    </div>
                  )}
                  {draft.frontTextStyle && (
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Text Style
                      </span>
                      <p className="text-sm text-gray-700 mt-1">
                        {draft.frontTextStyle}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Back Image */}
            {draft.backImage && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <ImageIcon className="h-4 w-4 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Back Design
                  </h3>
                </div>
                <div className="relative w-full h-72 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden flex items-center justify-center border border-gray-200 shadow-sm">
                  {backImageUrl.startsWith("data:") ? (
                    <img
                      src={backImageUrl}
                      alt="Back design"
                      className="absolute inset-0 w-full h-full object-contain"
                      onError={() => {
                        if (!backImageErrorRef.current) {
                          backImageErrorRef.current = true;
                        }
                      }}
                    />
                  ) : (
                    <Image
                      src={backImageUrl}
                      alt="Back design"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain"
                      onError={() => {
                        if (!backImageErrorRef.current) {
                          backImageErrorRef.current = true;
                        }
                      }}
                    />
                  )}
                </div>
                <div className="space-y-2 bg-gray-50 rounded-lg p-4">
                  {draft.backDescription && (
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Description
                      </span>
                      <p className="text-sm text-gray-700 mt-1">
                        {draft.backDescription}
                      </p>
                    </div>
                  )}
                  {draft.backText && (
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Text
                      </span>
                      <p className="text-sm text-gray-700 mt-1">
                        {draft.backText}
                      </p>
                    </div>
                  )}
                  {draft.backTextStyle && (
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Text Style
                      </span>
                      <p className="text-sm text-gray-700 mt-1">
                        {draft.backTextStyle}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Generator Image (if AI generated) */}
          {(draft.builderType === "AI Generator" ||
            (!draft.builderType &&
              (draft.generatorImage || draft.generatorPrompt))) && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  AI Generator
                </h3>
              </div>
              {draft.generatorImage && (
                <div className="relative w-full max-w-2xl h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden flex items-center justify-center mb-4 border border-gray-200 shadow-sm">
                  {generatorImageUrl.startsWith("data:") ? (
                    <img
                      src={generatorImageUrl}
                      alt="Generator image"
                      className="absolute inset-0 w-full h-full object-contain"
                      onError={() => {
                        if (!generatorImageErrorRef.current) {
                          generatorImageErrorRef.current = true;
                        }
                      }}
                    />
                  ) : (
                    <Image
                      src={generatorImageUrl}
                      alt="Generator image"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain"
                      onError={() => {
                        if (!generatorImageErrorRef.current) {
                          generatorImageErrorRef.current = true;
                        }
                      }}
                    />
                  )}
                </div>
              )}
              {draft.generatorPrompt && (
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    AI Prompt
                  </span>
                  <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                    {draft.generatorPrompt}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Specifications Grid */}
          {(draft.coinShape ||
            draft.materialFinish ||
            draft.subject ||
            draft.contrastStyle ||
            draft.detailLevel ||
            draft.totalCoins) && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#1a2a3a] rounded-lg flex items-center justify-center">
                  <Settings className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Specifications
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {draft.coinShape && (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 shadow-sm">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Coin Shape
                    </h4>
                    <p className="text-base font-medium text-gray-900">
                      {draft.coinShape}
                    </p>
                  </div>
                )}
                {draft.materialFinish && (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 shadow-sm">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Material & Finish
                    </h4>
                    <p className="text-base font-medium text-gray-900">
                      {draft.materialFinish}
                    </p>
                  </div>
                )}
                {draft.subject && (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 shadow-sm">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Subject
                    </h4>
                    <p className="text-base font-medium text-gray-900">
                      {draft.subject}
                    </p>
                  </div>
                )}
                {draft.contrastStyle && (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 shadow-sm">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Contrast Style
                    </h4>
                    <p className="text-base font-medium text-gray-900">
                      {draft.contrastStyle}
                    </p>
                  </div>
                )}
                {draft.detailLevel && (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 shadow-sm">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Detail Level
                    </h4>
                    <p className="text-base font-medium text-gray-900">
                      {draft.detailLevel}
                    </p>
                  </div>
                )}
                {draft.totalCoins && (
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 shadow-sm">
                    <h4 className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">
                      Total Coins
                    </h4>
                    <p className="text-2xl font-bold text-blue-900">
                      {draft.totalCoins}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Details */}
          {(draft.frontReference ||
            draft.frontReferenceImpact ||
            draft.frontComposition ||
            draft.backReference ||
            draft.backReferenceImpact ||
            draft.backComposition ||
            draft.designerInstructions ||
            draft.prohibitedContent) && (
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#1a2a3a] rounded-lg flex items-center justify-center">
                  <Info className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Additional Details
                </h3>
              </div>
              <div className="space-y-4">
                {draft.frontReference && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Front Reference
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {draft.frontReference}
                    </p>
                  </div>
                )}

                {draft.frontReferenceImpact && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Front Reference Impact
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {draft.frontReferenceImpact}
                    </p>
                  </div>
                )}

                {draft.frontComposition && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Front Composition
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {draft.frontComposition}
                    </p>
                  </div>
                )}

                {draft.backReference && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Back Reference
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {draft.backReference}
                    </p>
                  </div>
                )}

                {draft.backReferenceImpact && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Back Reference Impact
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {draft.backReferenceImpact}
                    </p>
                  </div>
                )}

                {draft.backComposition && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Back Composition
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {draft.backComposition}
                    </p>
                  </div>
                )}

                {draft.designerInstructions && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">
                      Designer Instructions
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {draft.designerInstructions}
                    </p>
                  </div>
                )}

                {draft.prohibitedContent && (
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <h4 className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-2">
                      Prohibited Content
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {draft.prohibitedContent}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-4">
            <Button
              variant="ternary"
              onClick={() => router.push(`/drafts/${draftId}/edit`)}
              className="flex items-center justify-center gap-2 px-6 py-3 hover:bg-gray-100 transition-colors"
            >
              <Edit2 className="h-5 w-5" />
              Edit Draft
            </Button>
            <Button
              variant="primary"
              onClick={() => router.push("/drafts")}
              className="flex items-center justify-center gap-2 px-6 py-3 shadow-md hover:shadow-lg transition-shadow"
            >
              <Send className="h-5 w-5" />
              Submit for Quote
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraftDetailPage;
