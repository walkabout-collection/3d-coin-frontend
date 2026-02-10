"use client";
import React, { useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/src/components/common/button/Button";
import { Paperclip, X, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import ImageUpload from "@/src/components/common/imageUpload";
import { useStandardBuilderStore } from "@/src/store/useStandardBuilderStore";
import { useGenerateCoinSide } from "@/src/hooks/useQueries";
import Coin3DViewer from "@/src/components/common/Coin3DViewer";
import {
  validateAIGenerationInput,
  validateAIGenerationImageFile,
  validateAIGenerationImageDimensions,
} from "@/src/utils/validation";

const ArtWork = () => {
  const router = useRouter();
  const {
    artwork,
    updateArtworkSide,
    material,
    dimensions,
    edgeType,
    textRings,
  } = useStandardBuilderStore();
  const [activeTab, setActiveTab] = useState<"front" | "back">("front");
  const [error, setError] = useState<{ message: string } | undefined>(
    undefined,
  );
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Track generated images for each side separately
  const [generatedImages, setGeneratedImages] = useState<{
    front: string | null;
    back: string | null;
  }>({
    front: null,
    back: null,
  });

  const { front, back } = artwork;
  const currentTab = activeTab === "front" ? front : back;
  const currentGeneratedImage = generatedImages[activeTab];

  // Use generateCoinSide instead of uploadImage
  const { mutate: generateCoinSideMutate, isPending: isGenerating } =
    useGenerateCoinSide({
      onSuccess: (res) => {
        console.log("API Response:", res);

        if (res.success && res.data) {
          const { side, imageBase64 } = res.data;

          toast.success(
            `${side.charAt(0).toUpperCase() + side.slice(1)} side generated successfully!`,
          );

          // Create data URI from base64 string
          const imageUrl = `data:image/png;base64,${imageBase64}`;

          // Store generated image for the current side
          setGeneratedImages((prev) => ({
            ...prev,
            [side]: imageUrl,
          }));

          setError(undefined);
          setValidationErrors([]);
        } else {
          console.error("Invalid response from generateCoinSide API:", res);
          toast.error("Failed to process image from API");
          setError({ message: "Failed to process image from API" });
        }
      },
      onError: (error) => {
        console.error("API Error:", error);
        toast.error("Failed to generate image. Please try again.");
        setError({ message: "Failed to generate image. Please try again." });
      },
    });

  // Validate inputs
  const handleValidate = useCallback(async () => {
    const validation = await validateAIGenerationInput(
      currentTab.prompt || undefined,
      currentTab.attachedImage || undefined,
      undefined,
    );
    setValidationErrors(validation.errors);
    return validation.isValid;
  }, [currentTab.prompt, currentTab.attachedImage]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file
      const fileValidation = validateAIGenerationImageFile(file);
      if (!fileValidation.isValid) {
        setValidationErrors(fileValidation.errors);
        toast.error(fileValidation.errors[0] || "Invalid file");
        e.target.value = "";
        return;
      }

      // Validate dimensions
      const dimensionValidation =
        await validateAIGenerationImageDimensions(file);
      if (!dimensionValidation.isValid) {
        setValidationErrors(dimensionValidation.errors);
        toast.error(
          dimensionValidation.errors[0] || "Invalid image dimensions",
        );
        e.target.value = "";
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      updateArtworkSide(activeTab, {
        attachedImage: file,
        previewImage: imageUrl,
      });
      setError(undefined);
      setValidationErrors([]);
      toast.success("Image attached to prompt");
    } else {
      updateArtworkSide(activeTab, { attachedImage: null, previewImage: null });
    }
  };

  const handleRemoveAttachedImage = () => {
    updateArtworkSide(activeTab, { attachedImage: null, previewImage: null });
  };

  const handleGenerateClick = async () => {
    if (!currentTab.prompt && !currentTab.attachedImage) {
      toast.error("Please provide a prompt or attach an image");
      setError({
        message: "Please provide a prompt or attach an image to generate.",
      });
      return;
    }

    // Validate before submission
    const isValid = await handleValidate();
    if (!isValid && currentTab.prompt && currentTab.attachedImage) {
      toast.error("Please fix validation errors");
      return;
    }

    let fileToSend: File | undefined = currentTab.attachedImage || undefined;

    // Use the new generateCoinSide API with side parameter
    generateCoinSideMutate({
      side: activeTab,
      prompt: currentTab.prompt || undefined,
      image: fileToSend,
    });
  };

  const handleInsertClick = () => {
    if (!currentGeneratedImage) {
      toast.error("No generated image to insert");
      return;
    }

    // Update the store with only previewImage (not uploadedImage)
    // This will show the image on coin frame but not in the upload section below
    updateArtworkSide(activeTab, {
      previewImage: currentGeneratedImage,
      // Don't set uploadedImage - this prevents it from showing in ImageUpload component
    });

    // Clear the generated image after inserting
    setGeneratedImages((prev) => ({
      ...prev,
      [activeTab]: null,
    }));

    toast.success(
      `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} image inserted successfully!`,
    );
  };

  // Removed unused base64ToFile function

  const handleContinue = () => {
    console.log("Artwork Saved:", artwork);
    router.push("/standard-builder/confirm-packaging");
  };

  const handleGoBack = () => {
    router.push("/standard-builder/text-rings");
  };

  const canContinue = () => {
    return (
      front.prompt.trim().length > 0 ||
      front.attachedImage !== null ||
      front.uploadedImage !== null ||
      front.previewImage !== null ||
      back.prompt.trim().length > 0 ||
      back.attachedImage !== null ||
      back.uploadedImage !== null ||
      back.previewImage !== null
    );
  };

  // Removed unused currentPreviewImage variable

  return (
    <div className="min-h-screen flex flex-row items-start justify-center py-6">
      {/* Left Side - 3D Coin Viewer with Artwork */}
      <div className="flex justify-between mb-12 relative w-full max-w-2xl mr-8">
        <div className="flex flex-col items-center w-full">
          <div className="w-full h-[500px] relative bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg shadow-lg p-4">
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
        </div>
      </div>

      {/* Right Side - Artwork */}
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold text-gray-900 mb-6">
          Provide Detail for the Artwork
        </h1>

        <div className="w-full max-w-lg px-6 rounded-lg shadow-md">
          {/* Tabs */}
          <div className="flex mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("front")}
              className={`py-3 px-6 text-sm font-semibold uppercase ${
                activeTab === "front"
                  ? "text-black border-b-2 border-black"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Front
            </button>
            <button
              onClick={() => setActiveTab("back")}
              className={`py-3 px-6 text-sm font-semibold uppercase ${
                activeTab === "back"
                  ? "text-black border-b-2 border-black"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Back
            </button>
          </div>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-800 mb-1">
                    Validation Errors:
                  </p>
                  <ul className="list-disc list-inside text-sm text-red-700">
                    {validationErrors.map((err, index) => (
                      <li key={index}>{err}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Prompt + Image Upload */}
          <div className="relative">
            <div className="text-center max-w-6xl mx-auto">
              <div className="flex flex-col">
                <div className="relative mb-8">
                  <div className="w-full border-2 border-yellow-500 shadow-lg shadow-yellow-400/20 rounded-xl p-6 text-left flex flex-col">
                    {/* Attached Image Preview */}
                    {currentTab.attachedImage && (
                      <div className="mb-3 relative inline-block">
                        <Image
                          src={URL.createObjectURL(currentTab.attachedImage)}
                          alt="Attached"
                          width={64}
                          height={64}
                          className="object-cover rounded-md border border-gray-300 shadow"
                        />
                        <button
                          onClick={handleRemoveAttachedImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}

                    {/* Prompt Textarea */}
                    <textarea
                      className="w-full bg-transparent outline-none resize-none text-base placeholder-gray-400 text-gray-800 leading-relaxed flex-1 min-h-[150px] pr-4 mb-4"
                      placeholder={`Enter prompt for ${activeTab} image (10-1000 characters)…`}
                      value={currentTab.prompt}
                      onChange={(e) => {
                        updateArtworkSide(activeTab, {
                          prompt: e.target.value,
                        });
                        setValidationErrors([]);
                      }}
                      onBlur={handleValidate}
                      maxLength={1000}
                    />
                    {currentTab.prompt && (
                      <div className="text-xs text-gray-500 mb-2 text-right">
                        {currentTab.prompt.length}/1000 characters
                      </div>
                    )}

                    {/* Action Buttons Inside Prompt Box */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <button
                        className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2.5 rounded-full transition-all duration-200 cursor-pointer font-medium text-sm"
                        onClick={() =>
                          document
                            .getElementById(`image-upload-prompt-${activeTab}`)
                            ?.click()
                        }
                        type="button"
                      >
                        <Paperclip size={18} className="text-gray-600" />
                        <span>ATTACH</span>
                      </button>

                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                        id={`image-upload-prompt-${activeTab}`}
                      />

                      <Button
                        className="!bg-blue-900 hover:!bg-blue-800 text-white px-6 py-2.5 rounded-full font-semibold text-sm max-w-[140px] flex items-center justify-center gap-2"
                        onClick={handleGenerateClick}
                        variant="primary"
                        disabled={isGenerating || validationErrors.length > 0}
                        type="button"
                      >
                        {isGenerating ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Processing...</span>
                          </>
                        ) : (
                          "GENERATE"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Generated Image Preview with Insert Button */}
                {currentGeneratedImage && (
                  <div className="mb-6 p-4 bg-gray-50 border-2 border-gray-200 rounded-xl">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                      Generated{" "}
                      {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                      Preview
                    </h3>
                    <div className="relative aspect-square max-w-xs mx-auto mb-4 rounded-lg overflow-hidden border-2 border-gray-300">
                      <Image
                        src={currentGeneratedImage}
                        alt={`Generated ${activeTab} preview`}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex justify-center">
                      <Button
                        onClick={handleInsertClick}
                        variant="primary"
                        className="!bg-green-600 hover:!bg-green-700 text-white px-8 py-2.5 rounded-full font-semibold text-sm"
                        type="button"
                      >
                        INSERT INTO {activeTab.toUpperCase()}
                      </Button>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mt-1 text-red-500 text-sm">
                    <span>{error.message}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* OR Upload */}
          <div className="flex justify-center mb-1 items-center">
            <div className="border-t border-gray-400 w-full"></div>
            <div className="px-4 text-sm text-gray-700 bg-white">OR</div>
            <div className="border-t border-gray-400 w-full"></div>
          </div>

          <ImageUpload
            onChange={(file) =>
              updateArtworkSide(activeTab, { uploadedImage: file })
            }
            value={
              activeTab === "front" ? front.uploadedImage : back.uploadedImage
            }
            error={error?.message}
            id={`image-upload-artwork-${activeTab}`}
          />

          <p className="text-gray-600 mb-6 mt-4">
            Our 3D Builder may have limitations that our design team can address
            after submission.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-8 justify-between">
          <Button variant="ternary" onClick={handleGoBack}>
            Go Back
          </Button>
          <Button
            variant="primary"
            onClick={handleContinue}
            disabled={!canContinue()}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArtWork;
