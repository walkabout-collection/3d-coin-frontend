"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Button from "@/src/components/common/button/Button";
import { bottomButtons } from "@/src/containers/design-summary/data";
import { PaymentOption } from "@/src/containers/payment-method/types";
import Input from "@/src/components/common/input";
import { useStandardBuilderStore } from "@/src/store/useStandardBuilderStore";
import { useCoinDesignStore } from "@/src/store/useCoinStore";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useCreateDesign, useUpdateDraft } from "@/src/hooks/useQueries";
import PaymentModal from "@/src/components/PaymentMethodModal.tsx";
import { uploadBase64ToS3, getS3RetrieveUrl } from "@/src/services/apiServices";
import LoadingSpinner from "@/src/components/common/LoadingSpinner";
import Coin3DViewer from "@/src/components/common/Coin3DViewer";

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
  const [frontImageUrl, setFrontImageUrl] = useState<string | null>(null);
  const [backImageUrl, setBackImageUrl] = useState<string | null>(null);

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

  const {
    dimensions,
    material,
    edgeType,
    artwork,
    packaging,
    textRings,
    currentDraftId,
  } = useStandardBuilderStore();

  // Check if this is an AI Generator design (has data in AI Generator store)
  const {
    front: aiFront,
    back: aiBack,
    designId: aiDesignId,
  } = useCoinDesignStore();
  const isAIGeneratorDesign = !!(aiFront.image || aiBack.image || aiDesignId);

  const { mutate: updateDraft, isPending: isUpdatingDraft } = useUpdateDraft({
    onSuccess: () => {
      toast.success("Draft updated successfully!");
      router.push("/drafts");
    },
    onError: (err) => {
      console.error("UpdateDraft error:", err);
      toast.error("Failed to update draft: " + err.message);
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

  // Helper function to get image URL from previewImage (handles S3 keys, URLs, base64)
  const getImageUrl = async (
    previewImage: string | null | undefined,
  ): Promise<string | null> => {
    if (!previewImage) return null;

    // If it's already a valid URL (presigned, data, or blob), use directly
    if (
      previewImage.startsWith("http://") ||
      previewImage.startsWith("https://") ||
      previewImage.startsWith("data:") ||
      previewImage.startsWith("blob:")
    ) {
      return previewImage;
    }

    // If it's a local path, return null (placeholder)
    if (previewImage.startsWith("/")) {
      return null;
    }

    // Otherwise, assume it's an S3 key and get presigned URL
    try {
      const response = await getS3RetrieveUrl(previewImage);
      return response.url || null;
    } catch (error) {
      console.error("Error getting S3 presigned URL:", error);
      return null;
    }
  };

  // Fetch artwork image URLs when artwork changes
  useEffect(() => {
    const loadArtworkImages = async () => {
      const frontUrl = await getImageUrl(artwork.front.previewImage);
      const backUrl = await getImageUrl(artwork.back.previewImage);
      setFrontImageUrl(frontUrl);
      setBackImageUrl(backUrl);
    };

    loadArtworkImages();
  }, [artwork.front.previewImage, artwork.back.previewImage]);

  // Calculate scale factor to ensure coin fits within frame for all diameters
  // Frame width is ~494px, coin viewer container is 600px
  // We need to scale coins so they fit within the frame regardless of diameter
  const parseDimension = (dim: string, defaultValue: number = 25): number => {
    if (!dim) return defaultValue;
    const match = dim.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : defaultValue;
  };

  const coinDiameter = parseDimension(dimensions?.coinDiameter || "25");
  const baseDiameter = 25; // Base diameter in mm (used in ModularCoin)
  const diameterRatio = coinDiameter / baseDiameter;

  // Frame dimensions: width ~494px, coin viewer is 600px
  // We want to ensure coin fits within frame width
  // Base scale: 1.0 for 25mm coin should fit in frame
  // For larger coins, scale down proportionally
  // For smaller coins, can scale up slightly but keep within bounds
  const frameWidth = 494;
  const viewerWidth = 600;
  const baseScale = frameWidth / viewerWidth; // ~0.823 for base fit

  // Scale factor: larger coins need more scaling down
  // Formula: scale = baseScale / diameterRatio
  // This ensures larger diameters scale down more to fit
  const viewerScale = baseScale / diameterRatio;

  // Clamp scale to reasonable bounds (0.6 to 1.0) to prevent extreme scaling
  // Max scale of 1.0 ensures we don't make coins larger than container
  const clampedScale = Math.max(0.6, Math.min(1.0, viewerScale));

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
        frontText:
          textRings.front.top && textRings.front.bottom
            ? `${textRings.front.top}\n${textRings.front.bottom}`
            : textRings.front.top || textRings.front.bottom || undefined,
        backImage: backImageKey,
        backDescription: artwork.back.prompt || undefined,
        backText:
          textRings.back.top && textRings.back.bottom
            ? `${textRings.back.top}\n${textRings.back.bottom}`
            : textRings.back.top || textRings.back.bottom || undefined,
        coinShape: dimensions.coinDiameter
          ? `Diameter: ${dimensions.coinDiameter}`
          : undefined,
        materialFinish: material || undefined,
        packaging: packaging.preferences ? true : false,
        description: packaging.preferences || undefined,
        text: packaging.backText || undefined,
      };

      console.log("Submitting designData with S3 keys:", designData);

      // If editing an existing draft and status is DRAFT, use updateDraft
      if (status === "DRAFT" && currentDraftId) {
        // For updateDraft, we only send draft-specific fields (no status, email, method, feedback, packaging)
        const draftUpdateData = {
          name: designData.name,
          totalCoins: designData.totalCoins,
          builderType: "Standard Builder" as const,
          generatorPrompt: designData.generatorPrompt,
          generatorImage: designData.generatorImage,
          frontImage: designData.frontImage,
          frontDescription: designData.frontDescription,
          frontText: designData.frontText,
          backImage: designData.backImage,
          backDescription: designData.backDescription,
          backText: designData.backText,
          frontTextStyle: undefined, // Can be added if needed
          backTextStyle: undefined, // Can be added if needed
          coinShape: designData.coinShape,
          materialFinish: designData.materialFinish,
        };
        updateDraft({
          draftId: currentDraftId,
          data: draftUpdateData,
        });
      } else {
        createDesign(designData);
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
    console.log("handlePaymentSelect called with:", { option, amount, email });
    setSelectedPayment(option);
    setAmount(amount);
    handleSubmitForQuote(option, amount, email, "SUBMITTED");
  };

  const handleSaveAsDraft = async () => {
    // Prevent saving AI Generator designs as drafts in design-summary
    // AI Generator designs should only be saved in CoinDesignInterface
    if (isAIGeneratorDesign) {
      toast.warning(
        "AI Generator designs should be saved from the AI Generator interface. Please use the 'Save as Draft' button in the AI Generator design view.",
      );
      return;
    }

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

  // Helper function to format artwork display
  const formatArtworkDisplay = (side: "front" | "back") => {
    const sideData = artwork[side];
    if (sideData.prompt) {
      return sideData.prompt;
    }
    // For back side, don't show "Image Uploaded" in display (data still sent in payload)
    if (side === "back") {
      return "N/A";
    }
    // For front side, show image status
    if (sideData.previewImage) {
      // Check if it's a base64 data URL
      if (sideData.previewImage.startsWith("data:image/")) {
        return "Image Uploaded";
      }
      // If it's a URL or path, show a shorter version
      return "Image Uploaded";
    }
    if (sideData.uploadedImage) {
      return "Image Uploaded";
    }
    if (sideData.attachedImage) {
      return "Image Attached";
    }
    return "N/A";
  };

  // Determine if packaging is enabled (user selected "Yes" and has preferences or backText)
  const isPackagingEnabled = !!(packaging.preferences || packaging.backText);

  const summaryOptions = [
    {
      id: 1,
      label: "Dimensions",
      type: "size",
      // image: "/images/home/dimensions.png", // Commented out - images removed for cleaner UI
      path: "/standard-builder",
      fields: [
        { label: "Diameter", value: dimensions.coinDiameter || "N/A" },
        { label: "Thickness", value: dimensions.coinThickness || "N/A" },
      ],
    },
    {
      id: 2,
      label: "Material",
      type: "material",
      // image: "/images/home/dimensions.png", // Commented out - images removed for cleaner UI
      path: "/standard-builder/material",
      fields: [{ label: "Material", value: material || "N/A" }],
    },
    {
      id: 3,
      label: "Edge Type",
      type: "edge",
      // image: "/images/home/dimensions.png", // Commented out - images removed for cleaner UI
      path: "/standard-builder/edge-type",
      fields: [{ label: "Edge", value: edgeType || "N/A" }],
    },
    {
      id: 4,
      label: "Artwork",
      type: "artwork",
      // image: frontImageUrl || backImageUrl || "/images/home/dimensions.png", // Commented out - images removed for cleaner UI
      path: "/standard-builder/artwork",
      fields: [
        { label: "Front", value: formatArtworkDisplay("front") },
        { label: "Back", value: formatArtworkDisplay("back") },
      ],
    },
    // Only include packaging if it's enabled
    ...(isPackagingEnabled
      ? [
          {
            id: 5,
            label: "Packaging",
            type: "packaging",
            // image: "/images/home/dimensions.png", // Commented out - images removed for cleaner UI
            path: "/standard-builder/packaging",
            fields: [
              {
                label: "Preferences",
                value: packaging.preferences || "N/A",
              },
              { label: "Back Text", value: packaging.backText || "N/A" },
            ],
          },
        ]
      : []),
  ];

  return (
    <div className="max-w-4xl mx-auto py-14">
      <h2 className="text-3xl max-w-xl mx-auto font-bold text-gray-900 mb-12 text-center">
        Work with our expert team to create your custom design.
      </h2>

      <div className="space-y-2">
        {summaryOptions.map((option) => {
          return (
            <div
              key={option.id}
              className="flex items-start justify-between bg-gray-100 py-5 px-6 rounded-lg gap-4"
            >
              <div className="flex-1 min-w-0">
                {/* Bold heading for each section */}
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {option.label}
                </h3>
                {/* Clean labeled fields */}
                <div className="space-y-2">
                  {option.fields.map((field, index) => (
                    <div key={index} className="text-sm text-gray-800">
                      <span className="font-medium">{field.label}:</span>{" "}
                      <span className="text-gray-700">{field.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Edit button */}
              <div
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors flex-shrink-0 mt-1"
                onClick={() => {
                  // Mark that we're editing from Design Summary to preserve store data
                  sessionStorage.setItem("editing-from-design-summary", "true");
                  router.push(option.path);
                }}
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
          );
        })}
      </div>

      {/* Coin Preview - 3D Interactive Viewer */}
      <div className="flex justify-center mb-12 relative">
        <div className="flex flex-col items-center relative">
          {/* Coin container - scaled and positioned */}
          <div
            className="relative z-10"
            style={{
              width: "600px",
              height: "600px",
              transform: `scale(${clampedScale})`,
              transformOrigin: "80% 100%", // Scale from center horizontally, bottom vertically
              marginBottom: "-150px", // Fixed overlap to position coin on frame
            }}
          >
            <Coin3DViewer
              materialId={material || "gold"}
              dimensions={dimensions}
              edgeType={edgeType}
              textRings={textRings}
              artwork={artwork}
              className="w-full h-full"
              autoRotate={true}
              enableControls={true}
            />
          </div>
          {/* Frame - positioned below coin */}
          <div className="relative z-0">
            <Image
              src="/images/home/frame.png"
              alt="Coin Base"
              width={494}
              height={143}
            />
          </div>
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
        {isLoggedIn && !isAIGeneratorDesign && (
          <Button
            type="button"
            variant="ternary"
            onClick={handleSaveAsDraft}
            className="max-w-[280px] w-full text-md font-base !bg-gray-200 border-none flex items-center justify-center gap-2"
            disabled={isPending || isUpdatingDraft}
          >
            {isPending || isUpdatingDraft ? (
              <>
                <LoadingSpinner size="sm" className="text-gray-600" />
                <span>Saving...</span>
              </>
            ) : (
              "SAVE AS DRAFT"
            )}
          </Button>
        )}
        <Button
          type="button"
          variant="primary"
          onClick={() =>
            handleSubmitForQuote(undefined, undefined, undefined, "SUBMITTED")
          }
          className="max-w-[280px] w-full text-lg font-medium flex items-center justify-center gap-2"
          disabled={isPending || isUpdatingDraft || selectedButton === null}
        >
          {isPending ? (
            <>
              <LoadingSpinner size="sm" className="text-white" />
              <span>Submitting...</span>
            </>
          ) : (
            "SUBMIT FOR QUOTE"
          )}
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
