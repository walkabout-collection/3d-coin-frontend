"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAdminQuoteById } from "@/src/hooks/useQueries";
import { X, FileText, Loader2, AlertCircle, ImageIcon } from "lucide-react";
import Image from "next/image";
import ImageViewerModal from "@/src/components/common/ImageViewerModal";

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

interface CoinDesign {
  id: string;
  frontImage?: string;
  backImage?: string;
  generatorImage?: string;
  frontDescription?: string;
  backDescription?: string;
  name?: string;
}

interface Packaging {
  id?: string;
  referenceImg?: string | null;
  description?: string;
  text?: string;
}

interface Quote {
  orderId: string;
  status: string;
  method: string;
  totalCoins: number;
  feedback?: string;
  email: string;
  user?: User;
  packaging?: boolean; // Boolean flag
  description?: string;
  createdAt: string;
  coinDesign?: CoinDesign | null;
  CoinDesign?: CoinDesign | null; // API returns uppercase with presigned URLs
  Packaging?: Packaging | null; // API returns uppercase
}

interface UseAdminQuoteByIdResult {
  data?: Quote;
  isLoading: boolean;
  isError: boolean;
}

interface ViewQuoteModalProps {
  id: string;
  onClose: () => void;
}

const ViewQuoteModal: React.FC<ViewQuoteModalProps> = ({ id, onClose }) => {
  const frontImageErrorRef = useRef(false);
  const backImageErrorRef = useRef(false);
  const generatorImageErrorRef = useRef(false);
  const [viewerImage, setViewerImage] = useState<{
    url: string;
    alt: string;
    title?: string;
  } | null>(null);

  const {
    data: quote,
    isLoading,
    isError,
  } = useAdminQuoteById(id) as UseAdminQuoteByIdResult;

  // API returns CoinDesign (uppercase) with presigned URLs
  const coinDesign = quote?.CoinDesign || quote?.coinDesign;
  const packaging = quote?.Packaging;

  // Helper to get image URL - API returns presigned URLs directly
  const getImageUrl = (imageUrl: string | null | undefined): string | null => {
    // API returns presigned URLs (full URLs) or null
    if (!imageUrl) return null;
    // Presigned URLs are already full URLs, use directly
    return imageUrl;
  };

  const frontImageUrl = useMemo(() => {
    if (frontImageErrorRef.current || !coinDesign?.frontImage) {
      return null;
    }
    return getImageUrl(coinDesign.frontImage);
  }, [coinDesign?.frontImage]);

  const backImageUrl = useMemo(() => {
    if (backImageErrorRef.current || !coinDesign?.backImage) {
      return null;
    }
    return getImageUrl(coinDesign.backImage);
  }, [coinDesign?.backImage]);

  const generatorImageUrl = useMemo(() => {
    if (generatorImageErrorRef.current || !coinDesign?.generatorImage) {
      return null;
    }
    return getImageUrl(coinDesign.generatorImage);
  }, [coinDesign?.generatorImage]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full relative transform transition-all animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1a2a3a] rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Quote Details</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-[#1a2a3a] mb-4" />
              <p className="text-gray-600 font-medium">
                Loading quote details...
              </p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <p className="text-red-600 font-medium">Failed to load quote</p>
            </div>
          ) : quote ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Order ID
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {quote.orderId ? (
                      quote.orderId
                    ) : (
                      <span className="text-gray-600 italic">Pending</span>
                    )}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Status
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {quote.status}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Method
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {quote.method}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Total Coins
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {quote.totalCoins}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Email
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {quote.user ? quote.user.email : quote.email}
                </p>
              </div>

              {quote.feedback && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Feedback
                  </p>
                  <p className="text-sm text-gray-900 leading-relaxed">
                    {quote.feedback}
                  </p>
                </div>
              )}

              {/* Images Section */}
              {(frontImageUrl || backImageUrl || generatorImageUrl) && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                    Design Images
                  </h3>

                  {frontImageUrl && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-3">
                        <ImageIcon className="h-4 w-4 text-gray-600" />
                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                          Front Design
                        </p>
                      </div>
                      <div
                        className="relative w-full h-48 bg-white rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => {
                          if (frontImageUrl) {
                            setViewerImage({
                              url: frontImageUrl,
                              alt: "Front design",
                              title: "Front Design",
                            });
                          }
                        }}
                        title="Click to view full image"
                      >
                        <Image
                          src={frontImageUrl}
                          alt="Front design"
                          fill
                          className="object-contain"
                          onError={() => {
                            frontImageErrorRef.current = true;
                          }}
                        />
                      </div>
                      {coinDesign?.frontDescription && (
                        <p className="text-xs text-gray-600 mt-2">
                          {coinDesign.frontDescription}
                        </p>
                      )}
                    </div>
                  )}

                  {backImageUrl && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-3">
                        <ImageIcon className="h-4 w-4 text-gray-600" />
                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                          Back Design
                        </p>
                      </div>
                      <div
                        className="relative w-full h-48 bg-white rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => {
                          if (backImageUrl) {
                            setViewerImage({
                              url: backImageUrl,
                              alt: "Back design",
                              title: "Back Design",
                            });
                          }
                        }}
                        title="Click to view full image"
                      >
                        <Image
                          src={backImageUrl}
                          alt="Back design"
                          fill
                          className="object-contain"
                          onError={() => {
                            backImageErrorRef.current = true;
                          }}
                        />
                      </div>
                      {coinDesign?.backDescription && (
                        <p className="text-xs text-gray-600 mt-2">
                          {coinDesign.backDescription}
                        </p>
                      )}
                    </div>
                  )}

                  {generatorImageUrl && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-3">
                        <ImageIcon className="h-4 w-4 text-gray-600" />
                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                          Generator Image
                        </p>
                      </div>
                      <div
                        className="relative w-full h-48 bg-white rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => {
                          if (generatorImageUrl) {
                            setViewerImage({
                              url: generatorImageUrl,
                              alt: "Generator image",
                              title: "Generator Image",
                            });
                          }
                        }}
                        title="Click to view full image"
                      >
                        <Image
                          src={generatorImageUrl}
                          alt="Generator image"
                          fill
                          className="object-contain"
                          onError={() => {
                            generatorImageErrorRef.current = true;
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Packaging Image */}
              {packaging?.referenceImg && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <ImageIcon className="h-4 w-4 text-gray-600" />
                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Packaging Reference
                    </p>
                  </div>
                  <div
                    className="relative w-full h-48 bg-white rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => {
                      if (packaging.referenceImg) {
                        setViewerImage({
                          url: packaging.referenceImg,
                          alt: "Packaging reference",
                          title: "Packaging Reference",
                        });
                      }
                    }}
                    title="Click to view full image"
                  >
                    <Image
                      src={packaging.referenceImg}
                      alt="Packaging reference"
                      fill
                      className="object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/home/coin-design.png";
                      }}
                    />
                  </div>
                  {packaging.description && (
                    <p className="text-xs text-gray-600 mt-2">
                      {packaging.description}
                    </p>
                  )}
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Packaging
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {quote.packaging || packaging ? "Yes" : "No"}
                </p>
                {packaging?.description && (
                  <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                    {packaging.description}
                  </p>
                )}
                {quote.description && !packaging?.description && (
                  <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                    {quote.description}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs font-medium text-gray-700">
                  Created At:{" "}
                  <span className="text-gray-900">
                    {new Date(quote.createdAt).toLocaleString()}
                  </span>
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Image Viewer Modal */}
      {viewerImage && (
        <ImageViewerModal
          imageUrl={viewerImage.url}
          alt={viewerImage.alt}
          title={viewerImage.title}
          onClose={() => setViewerImage(null)}
        />
      )}
    </div>
  );
};

export default ViewQuoteModal;
