"use client";
import React, { useState } from "react";
import Button from "@/src/components/common/button/Button";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";

interface PaymentProofPreviewProps {
  proof: string | null; // Base64 image string
  onRemove?: () => void;
  onError?: (error: string) => void;
}

export const PaymentProofPreview: React.FC<PaymentProofPreviewProps> = ({
  proof,
  onRemove,
  onError,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!proof) {
    return null;
  }

  const handleImageError = () => {
    setImageError(true);
    const errorMsg = "Invalid image file. Please upload a valid image.";
    onError?.(errorMsg);
    toast.error(errorMsg);
  };

  const handleRemove = () => {
    setImageError(false);
    onRemove?.();
  };

  if (imageError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-red-800">
            Invalid image file. Please upload a new one.
          </p>
          <Button
            variant="ternary"
            onClick={handleRemove}
            className="!px-3 !py-1 text-xs"
          >
            Remove
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="relative border border-gray-300 rounded-lg p-2 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Payment Proof Preview
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="p-1.5 rounded-md hover:bg-gray-200 transition-colors"
              title={isZoomed ? "Zoom Out" : "Zoom In"}
            >
              {isZoomed ? (
                <ZoomOut className="h-4 w-4 text-gray-600" />
              ) : (
                <ZoomIn className="h-4 w-4 text-gray-600" />
              )}
            </button>
            {onRemove && (
              <button
                onClick={handleRemove}
                className="p-1.5 rounded-md hover:bg-gray-200 transition-colors"
                title="Remove"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            )}
          </div>
        </div>
        <div
          className={`overflow-hidden rounded ${
            isZoomed ? "max-h-96" : "max-h-48"
          }`}
        >
          <div
            className={`cursor-pointer ${isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`}
            onClick={() => setIsZoomed(!isZoomed)}
          >
            <Image
              src={proof}
              alt="Payment proof"
              width={600}
              height={400}
              className="w-full h-auto object-contain"
              onError={handleImageError}
            />
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-700 font-medium">
        Click image to zoom in/out. Make sure the payment details are clearly
        visible.
      </p>
    </div>
  );
};
