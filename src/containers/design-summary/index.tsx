"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Button from "@/src/components/common/button/Button";
import { bottomButtons } from "@/src/containers/design-summary/data";
import { PaymentOption } from "@/src/containers/payment-method/types";
import Input from "@/src/components/common/input";
import { useStandardBuilderStore } from "@/src/store/useStandardBuilderStore";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useCreateDesign } from "@/src/hooks/useQueries";
import PaymentModal from "@/src/components/PaymentMethodModal.tsx";
import { uploadBase64ToS3 } from "@/src/services/apiServices";

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const DesignSummarySection = () => {
  const [selectedButton, setSelectedButton] = useState<number | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentOption | null>(
    null,
  );
  const [feedback, setFeedback] = useState<string>("");
  const [amount, setAmount] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();
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
      setFeedback("");
      if (!isDraft) {
        router.push("/");
      }
    },
    onError: (err) => {
      console.error("CreateDesign error:", err);
      toast.error("Failed to save design: " + err.message);
    },
  });

  const { dimensions, material, edgeType, artwork, packaging, textRings } =
    useStandardBuilderStore();

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

  const handleButtonClick = (id: number) => {
    setSelectedButton(selectedButton === id ? null : id);
  };

  const handleSubmitForQuote = async (
    paymentOption?: PaymentOption,
    amountValue?: number,
    email?: string,
    status: "DRAFT" | "SUBMITTED" = "SUBMITTED",
  ) => {
    const payment = paymentOption || selectedPayment;
    const qty = amountValue !== undefined ? amountValue : amount;

    console.log("handleSubmitForQuote called with:", {
      payment,
      qty,
      email,
      status,
    });

    // For DRAFT status, we don't need payment or amount
    if (status === "DRAFT") {
      // Skip payment validation for drafts
    } else if (!payment || qty === null) {
      console.log("Opening PaymentModal due to missing payment or amount");
      setShowPaymentModal(true);
      return;
    }

    if (!isLoggedIn && !email && status !== "DRAFT") {
      console.log(
        "Opening PaymentModal due to missing email and not logged in",
      );
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

      // Upload images to S3 if they are base64
      const [generatorImageKey, frontImageKey, backImageKey] =
        await Promise.all([
          getS3KeyOrOriginal(
            artwork.front.previewImage ||
              artwork.back.previewImage ||
              undefined,
            `generator-${Date.now()}.png`,
          ),
          getS3KeyOrOriginal(
            artwork.front.previewImage || undefined,
            `front-${Date.now()}.png`,
          ),
          getS3KeyOrOriginal(
            artwork.back.previewImage || undefined,
            `back-${Date.now()}.png`,
          ),
        ]);

      const designData = {
        name: "Custom Coin Design",
        status: status,
        totalCoins: status === "DRAFT" ? 0 : (qty ?? undefined),
        email: email || undefined,
        method: (status === "DRAFT"
          ? "STRIPE"
          : payment!.name.toUpperCase()) as "STRIPE" | "QUICKBOOKS" | "MANUAL",
        feedback: feedback || undefined,
        generatorPrompt:
          artwork.front.prompt || artwork.back.prompt || undefined,
        generatorImage: generatorImageKey,
        frontImage: frontImageKey,
        frontDescription: artwork.front.prompt || undefined,
        frontText: textRings.front.top || textRings.front.bottom || undefined,
        backImage: backImageKey,
        backDescription: artwork.back.prompt || undefined,
        backText: textRings.back.top || textRings.back.bottom || undefined,
        coinShape: dimensions.coinDiameter
          ? `Diameter: ${dimensions.coinDiameter}`
          : undefined,
        materialFinish: material || undefined,
        packaging: packaging.preferences ? true : false,
        description: packaging.preferences || undefined,
        text: packaging.backText || undefined,
      };

      console.log("Submitting designData with S3 keys:", designData);

      createDesign(designData);
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
    console.log("handlePaymentSelect called with:", { option, amount, email });
    setSelectedPayment(option);
    setAmount(amount);
    handleSubmitForQuote(option, amount, email, "SUBMITTED");
  };

  const handleSaveAsDraft = async () => {
    // For draft, we don't need payment or amount, so we can call directly
    await handleSubmitForQuote(undefined, undefined, undefined, "DRAFT");
  };

  const handleModalClose = () => {
    setShowPaymentModal(false);
  };

  const handleFirstButtonAction = async () => {
    // Placeholder function - can be implemented when needed
    // Removed dummy API call to prevent console errors
  };

  const summaryOptions = [
    {
      id: 1,
      label: "Dimensions",
      value: `Diameter: ${dimensions.coinDiameter}, Thickness: ${dimensions.coinThickness}`,
      type: "size",
      image: "/images/home/dimensions.png",
      path: "/standard-builder",
    },
    {
      id: 2,
      label: "Material",
      value: material,
      type: "material",
      image: "/images/home/dimensions.png",
      path: "/standard-builder/material",
    },
    {
      id: 3,
      label: "Edge Type",
      value: edgeType,
      type: "edge",
      image: "/images/home/dimensions.png",
      path: "/standard-builder/edge-type",
    },
    {
      id: 4,
      label: "Artwork",
      value: `Front: ${artwork.front.prompt || artwork.front.previewImage || "N/A"}, Back: ${
        artwork.back.prompt || artwork.back.previewImage || "N/A"
      }`,
      type: "artwork",
      image: "/images/home/dimensions.png",
      path: "/standard-builder/artwork",
    },
    {
      id: 5,
      label: "Packaging",
      value: `Preferences: ${packaging.preferences}, Back Text: ${packaging.backText}`,
      type: "packaging",
      image: "/images/home/dimensions.png",
      path: "/standard-builder/packaging",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-14">
      <h2 className="text-3xl max-w-xl mx-auto font-bold text-gray-900 mb-12 text-center">
        Work with our expert team to create your custom design.
      </h2>

      <div className="space-y-4 mb-12">
        {summaryOptions.map((option) => (
          <div
            key={option.id}
            className="flex items-center justify-between bg-gray-100 py-3 px-4 rounded-lg"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg overflow-hidden">
                <Image
                  src={option.image}
                  alt={option.label}
                  width={50}
                  height={50}
                  className="object-contain"
                />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  {option.label}
                </div>
                <div className="text-sm text-gray-800 mt-1">
                  {option.type.toUpperCase()}: {option.value}
                </div>
              </div>
            </div>
            <div
              className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors"
              onClick={() => router.push(option.path)}
            >
              <Image
                src="/images/home/edit-icon.svg"
                alt="Edit Icon"
                width={14}
                height={14}
                className="cursor-pointer"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Coin Preview */}
      <div className="flex justify-center mb-12 relative">
        <div className="flex flex-col items-center">
          <Image
            src="/images/home/coin-design.png"
            alt="Coin"
            width={335}
            height={335}
            className="z-10"
          />
          <Image
            src="/images/home/frame.png"
            alt="Coin Base"
            width={494}
            height={143}
            className="mt-[-50px] z-0"
          />
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        {bottomButtons.map((btn, index) => (
          <Button
            key={btn.id}
            type="button"
            variant="ternary"
            onClick={() => {
              handleButtonClick(btn.id);
              if (index === 0) {
                handleFirstButtonAction();
              } else if (index === 2) {
                router.push("/design-team");
              }
            }}
            className={`py-6 px-6 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedButton === btn.id
                ? "bg-white border drop-shadow-2xl shadow-yellow-400 border-yellow-400 text-black"
                : "bg-gray-200 text-gray-900 hover:border-gray-400"
            }`}
          >
            {btn.label}
          </Button>
        ))}
      </div>

      {selectedButton === 2 && (
        <div className="mx-auto mb-8">
          <label
            htmlFor="feedback"
            className="block text-md font-semibold text-gray-700 mb-2"
          >
            Feedback for Designer
          </label>
          <Input
            textarea
            rows={3}
            placeholder="Enter your feedback here"
            inputSize="md"
            className="border-none py-3 px-6 rounded-xl"
            bg="bg-gray-100"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        {isLoggedIn && (
          <Button
            type="button"
            variant="ternary"
            onClick={handleSaveAsDraft}
            className="max-w-[280px] w-full text-md font-base !bg-gray-200 border-none"
            disabled={isPending}
          >
            {isPending ? "Saving..." : "SAVE AS DRAFT"}
          </Button>
        )}
        <Button
          type="button"
          variant="primary"
          onClick={() =>
            handleSubmitForQuote(undefined, undefined, undefined, "SUBMITTED")
          }
          className="max-w-[280px] w-full text-lg font-medium"
          disabled={isPending}
        >
          {isPending ? "Submitting..." : "SUBMIT FOR QUOTE"}
        </Button>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={handleModalClose}
        onPaymentSelect={handlePaymentSelect}
      />
    </div>
  );
};

export default DesignSummarySection;
