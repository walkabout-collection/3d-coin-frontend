"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Button from "../common/button/Button";
import PaymentModal from "../PaymentMethodModal.tsx";
import { buttonTexts } from "./data";
import { ThreeDRenderProps } from "./types";
import {
  useCoinDesignStore,
  useQAPromptsStore,
} from "@/src/store/useCoinStore";
import { useCreateDesign } from "@/src/hooks/useQueries";
import { toast } from "react-toastify";
import { PaymentOption } from "@/src/containers/payment-method/types";
import { useRouter } from "next/navigation";
import { uploadBase64ToS3 } from "@/src/services/apiServices";

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

export const ThreeDRender: React.FC<ThreeDRenderProps> = ({
  name = "AI Generated 3D Render",
  onContinue,
  loading = false,
}) => {
  const router = useRouter();
  const { front, back } = useCoinDesignStore();
  const { formData } = useQAPromptsStore();
  const frontImage = front.image?.url || "/images/home/front-side.png";
  const backImage = back.image?.url || "/images/home/front-side.png";

  const [isProcessing, setIsProcessing] = useState(false);
  const [frontImageLoaded, setFrontImageLoaded] = useState(false);
  const [backImageLoaded, setBackImageLoaded] = useState(false);
  const [frontImageError, setFrontImageError] = useState(false);
  const [backImageError, setBackImageError] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentOption | null>(
    null,
  );
  const [amount, setAmount] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  const { mutate: createDesign, isPending } = useCreateDesign({
    onSuccess: (_, variables) => {
      const isDraft = variables.status === "DRAFT";
      toast.success(
        isDraft
          ? "Design saved as draft successfully!"
          : "Design submitted successfully!",
      );
      setShowPaymentModal(false);
      setSelectedPayment(null);
      setAmount(null);
      setIsProcessing(false);
      if (!isDraft) {
        router.push("/");
      }
    },
    onError: (err) => {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error("Failed to save design: " + msg);
      console.error("CreateDesign error:", err);
      setIsProcessing(false);
    },
  });

  const handleSaveAsDraft = async () => {
    if (!isLoggedIn) {
      toast.error("Please log in to save drafts");
      return;
    }

    // For draft, we don't need payment or amount, so we can call directly
    await handleSubmitForQuote(undefined, undefined, undefined, "DRAFT");
  };

  const handleSubmitForQuote = async (
    paymentOption?: PaymentOption,
    amountValue?: number,
    email?: string,
    status: "DRAFT" | "SUBMITTED" = "SUBMITTED",
  ) => {
    const payment = paymentOption || selectedPayment;
    const qty = amountValue !== undefined ? amountValue : amount;

    // For DRAFT status, we don't need payment or amount
    if (status === "DRAFT") {
      // Skip payment validation for drafts
    } else if (!payment || qty === null) {
      setShowPaymentModal(true);
      return;
    }

    if (!isLoggedIn && !email && status !== "DRAFT") {
      setShowPaymentModal(true);
      return;
    }

    try {
      // Helper function to check if a string is a base64 data URL
      const isBase64Image = (str: string | null | undefined): boolean => {
        return !!(
          str &&
          typeof str === "string" &&
          str.startsWith("data:image/")
        );
      };

      // Helper function to check if it's a blob URL
      const isBlobUrl = (str: string | null | undefined): boolean => {
        return !!(str && typeof str === "string" && str.startsWith("blob:"));
      };

      // Helper function to upload base64 image to S3 and return the key
      const getS3KeyOrOriginal = async (
        image: string | null | undefined,
        defaultFileName: string,
      ): Promise<string | undefined> => {
        if (!image) return undefined;

        console.log(`[getS3KeyOrOriginal] Processing ${defaultFileName}:`, {
          imageType: isBase64Image(image)
            ? "base64"
            : isBlobUrl(image)
              ? "blob"
              : "other",
          imagePreview: image.substring(0, 50) + "...",
        });

        // If it's a blob URL, convert it to base64 first
        if (isBlobUrl(image)) {
          console.log(
            `[getS3KeyOrOriginal] Converting blob URL to base64 for ${defaultFileName}`,
          );
          try {
            const response = await fetch(image);
            const blob = await response.blob();
            const base64 = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                if (typeof reader.result === "string") {
                  resolve(reader.result);
                } else {
                  reject(new Error("Failed to convert blob to base64"));
                }
              };
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
            // Now upload the base64 image
            const s3Key = await uploadBase64ToS3(base64, defaultFileName);
            return s3Key;
          } catch (error) {
            const errMsg =
              error instanceof Error ? error.message : String(error);
            console.error(
              `Failed to convert/upload blob URL for ${defaultFileName}:`,
              error,
            );
            toast.error(
              `Failed to upload ${defaultFileName}: ${errMsg || "Unknown error"}`,
            );
            throw error;
          }
        }

        // If it's a file path or external URL (not base64), return as is (assume it's already an S3 key or URL)
        if (!isBase64Image(image)) {
          // If it looks like a file path (starts with /), it's probably a default placeholder
          if (image.startsWith("/images/") || image.startsWith("/")) {
            console.log(
              `[getS3KeyOrOriginal] File path detected for ${defaultFileName}, skipping (placeholder)`,
            );
            return undefined; // Don't upload placeholder images
          }
          // Assume it's already an S3 key or valid URL
          return image;
        }

        // It's a base64 image, upload to S3
        try {
          const s3Key = await uploadBase64ToS3(image, defaultFileName);
          return s3Key;
        } catch (error) {
          const errMsg = error instanceof Error ? error.message : String(error);
          console.error(`Failed to upload ${defaultFileName} to S3:`, error);
          toast.error(
            `Failed to upload ${defaultFileName}: ${errMsg || "Unknown error"}`,
          );
          throw error;
        }
      };

      // Get reference images from formData, fallback to design store images if not persisted
      const frontReferenceRaw =
        formData.frontReferenceImage || frontImage || undefined;
      const backReferenceRaw =
        formData.backReferenceImage || backImage || undefined;

      // Upload images to S3 if they are base64
      const [frontImageKey, backImageKey, frontReferenceKey, backReferenceKey] =
        await Promise.all([
          getS3KeyOrOriginal(
            frontImage || undefined,
            `front-${Date.now()}.png`,
          ),
          getS3KeyOrOriginal(backImage || undefined, `back-${Date.now()}.png`),
          getS3KeyOrOriginal(
            frontReferenceRaw,
            `front-reference-${Date.now()}.png`,
          ),
          getS3KeyOrOriginal(
            backReferenceRaw,
            `back-reference-${Date.now()}.png`,
          ),
        ]);

      const designData = {
        name: name,
        status: status,
        totalCoins: status === "DRAFT" ? 0 : (qty ?? undefined),
        email: email || undefined,
        method: (status === "DRAFT"
          ? "STRIPE"
          : payment!.name.toUpperCase()) as "STRIPE" | "QUICKBOOKS" | "MANUAL",

        // FRONT
        frontImage: frontImageKey,
        frontDescription: formData.frontDescription || undefined,
        frontText: formData.frontTextInsideArtwork || undefined,
        frontTextStyle: formData.frontTextStyle || undefined,
        frontReference: frontReferenceKey,
        frontReferenceImpact: formData.frontReferenceImageImpact || undefined,
        frontComposition: formData.frontComposition || undefined,

        // BACK
        backImage: backImageKey,
        backDescription: formData.backDescription || undefined,
        backText: formData.backTextInsideArtwork || undefined,
        backTextStyle: formData.backTextStyle || undefined,
        backReference: backReferenceKey,
        backReferenceImpact: formData.backReferenceImageImpact || undefined,
        backComposition: formData.backComposition || undefined,

        coinShape: formData.coinShape || undefined,
        subject: formData.subject || undefined,
        materialFinish: formData.metalFinishes || undefined,
        detailLevel: formData.detailLevel || undefined,
        prohibitedContent: formData.prohibitedContent || undefined,
      };

      console.log("Submitting design with S3 keys:", designData);
      setIsProcessing(true);
      createDesign(designData);

      if (onContinue && status !== "DRAFT") {
        try {
          onContinue();
        } finally {
          setIsProcessing(false);
        }
      }
    } catch (error) {
      console.error("Error uploading images to S3:", error);
      // Error toast is already shown in getS3KeyOrOriginal
    }
  };

  const handlePaymentSelect = (
    option: PaymentOption,
    amount: number,
    email?: string,
  ) => {
    setSelectedPayment(option);
    setAmount(amount);
    handleSubmitForQuote(option, amount, email, "SUBMITTED");
  };

  const handleModalClose = () => {
    setShowPaymentModal(false);
  };

  return (
    <>
      <div className="max-w-5xl mx-auto p-8 bg-white min-h-screen py-16">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 tracking-wide">
            {name}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
          {/* Front */}
          <div className="flex flex-col w-full items-center">
            <h3 className="text-md text-start font-semibold text-gray-800 tracking-wide uppercase">
              Front Design
            </h3>
            <div className="relative flex items-center justify-center w-full max-w-[800px] h-[400px]">
              {!frontImageLoaded && !frontImageError && (
                <div className="animate-pulse text-gray-400">Loading...</div>
              )}
              <Image
                src={
                  frontImageError ? "/images/home/front-side.png" : frontImage
                }
                alt="Front coin render"
                fill
                className={`object-contain transition-all duration-500 ${
                  frontImageLoaded
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95"
                }`}
                onLoadingComplete={() => setFrontImageLoaded(true)}
                onError={() => {
                  setFrontImageError(true);
                  setFrontImageLoaded(false);
                }}
              />
            </div>
          </div>

          {/* Back */}
          <div className="flex flex-col w-full items-center">
            <h3 className="text-md font-semibold text-gray-800 tracking-wide uppercase">
              Back Design
            </h3>
            <div className="relative flex items-center justify-center w-full max-w-[500px] h-[400px]">
              {!backImageLoaded && !backImageError && (
                <div className="animate-pulse text-gray-400">Loading...</div>
              )}
              <Image
                src={backImageError ? "/images/home/front-side.png" : backImage}
                alt="Back coin render"
                fill
                className={`object-contain transition-all duration-500 ${
                  backImageLoaded
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95"
                }`}
                onLoadingComplete={() => setBackImageLoaded(true)}
                onError={() => {
                  setBackImageError(true);
                  setBackImageLoaded(false);
                }}
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center space-x-6 mt-8">
          {isLoggedIn && (
            <Button
              type="button"
              variant="ternary"
              onClick={handleSaveAsDraft}
              disabled={loading || isProcessing || isPending}
              className="max-w-[180px] w-full text-md font-base !bg-gray-200 border-none min-w-[140px]"
            >
              {isProcessing || isPending ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                buttonTexts.saveAsDraft
              )}
            </Button>
          )}

          <Button
            type="button"
            variant="primary"
            onClick={() => setShowPaymentModal(true)}
            disabled={loading || isProcessing || isPending}
            className="rounded-full font-base text-md max-w-[300px]"
          >
            {isPending ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span>{buttonTexts.loading}</span>
              </div>
            ) : (
              "SUBMIT FOR QUOTE"
            )}
          </Button>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={handleModalClose}
        onPaymentSelect={handlePaymentSelect}
      />
    </>
  );
};

export default ThreeDRender;
