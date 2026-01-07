"use client";
import React, { useState, useEffect } from "react";
import { Paperclip, X } from "lucide-react";
import Button from "../common/button/Button";
import Image from "next/image";
import { toast } from "react-toastify";
import { useGenerateCoinSide } from "@/src/hooks/useQueries";
import { useCoinDesignStore } from "@/src/store/useCoinStore";

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

interface CoinDesignInterfaceProps {
  onContinue: (frontImages: string[], backImages: string[]) => void;
  initialImages?: string[]; // Images from upload flow (ignored - handled by store)
}

const CoinDesignInterface: React.FC<CoinDesignInterfaceProps> = ({
  onContinue,
}) => {
  const [activeTab, setActiveTab] = useState<"front" | "back">("front");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const {
    designId,
    front,
    back,
    additionalVariants,
    setDesignId,
    setFrontImage,
    setBackImage,
    removeFrontImage,
    removeBackImage,
    setFrontPrompt,
    setBackPrompt,
    setFrontAttachedImage,
    setBackAttachedImage,
    replaceFrontImage,
    replaceBackImage,
    removeAdditionalVariant,
  } = useCoinDesignStore();

  const currentTab = activeTab === "front" ? front : back;
  const setPrompt = activeTab === "front" ? setFrontPrompt : setBackPrompt;
  const setAttachedImage =
    activeTab === "front" ? setFrontAttachedImage : setBackAttachedImage;
  const removeImage =
    activeTab === "front" ? removeFrontImage : removeBackImage;
  const replaceImage =
    activeTab === "front" ? replaceFrontImage : replaceBackImage;
  const setImage = activeTab === "front" ? setFrontImage : setBackImage;

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

  const { mutate: generateCoinSideMutate, isPending: isGenerating } =
    useGenerateCoinSide({
      onSuccess: (res) => {
        console.log("API Response:", res);

        if (res.success && res.data) {
          const { designId: returnedDesignId, side, imageBase64 } = res.data;

          toast.success(
            `${side.charAt(0).toUpperCase() + side.slice(1)} side generated successfully!`,
          );

          // Store design ID if this is the first generation
          if (!designId && returnedDesignId) {
            setDesignId(returnedDesignId);
          }

          // Create data URI from base64 string
          const imageUrl = `data:image/png;base64,${imageBase64}`;

          // Replace the current tab's image with the new one
          replaceImage(imageUrl);
        } else {
          console.error("Invalid response from generateCoinSide API:", res);
          toast.error("Failed to process image from API");
        }
      },
      onError: (error) => {
        console.error("API Error:", error);
        toast.error("Failed to generate image. Please try again.");
      },
    });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedImage(file);
      toast.success("Image attached to prompt");
    }
  };

  const handleRemoveAttachedImage = () => {
    setAttachedImage(null);
  };

  const handleRemoveCurrentImage = () => {
    removeImage();
    toast.success("Image removed");
  };

  const handleSelectAdditionalVariant = (imageUrl: string) => {
    // Set the selected additional variant as the current tab's image
    setImage(imageUrl);
    toast.success(`Image set as ${activeTab} image`);
  };

  const handleRemoveAdditionalVariant = (
    imageId: string,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    removeAdditionalVariant(imageId);
    toast.success("Variant removed");
  };

  const base64ToFile = (base64String: string, fileName: string): File => {
    const matches = base64String.match(/^data:(.*?);base64,(.*)$/);
    if (!matches) {
      throw new Error("Invalid base64 string");
    }

    const mime = matches[1];
    const data = matches[2];
    const byteString = atob(data);
    const n = byteString.length;
    const u8arr = new Uint8Array(n);

    for (let i = 0; i < n; i++) {
      u8arr[i] = byteString.charCodeAt(i);
    }

    return new File([u8arr], fileName, { type: mime });
  };

  const handleRegenerate = () => {
    if (!currentTab.prompt && !currentTab.attachedImage && !currentTab.image) {
      toast.error("Please provide a prompt or attach an image");
      return;
    }

    let fileToSend: File | undefined = currentTab.attachedImage || undefined;

    // If no attached image, use the current tab's image
    if (!fileToSend && currentTab.image) {
      fileToSend = base64ToFile(
        currentTab.image.url,
        `${activeTab}-preview.png`,
      );
    }

    // Use the new generateCoinSide API with side parameter
    generateCoinSideMutate({
      side: activeTab,
      prompt: currentTab.prompt || undefined,
      image: fileToSend,
      designId: designId || undefined,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // If Enter is pressed without Shift, trigger regenerate
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default new line
      handleRegenerate();
    }
    // Shift+Enter will allow new line (default behavior)
  };

  const handleContinueClick = () => {
    if (!front.image || !back.image) {
      toast.error(
        "Please generate or upload both front and back images before continuing.",
      );
      return;
    }
    const frontUrls = [front.image.url];
    const backUrls = [back.image.url];
    onContinue(frontUrls, backUrls);
  };

  const handleSaveDraft = () => {
    toast.info("Draft saved!");
  };

  return (
    <div className="min-h-screen">
      <div className="p-6 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Section - Input Area */}
          <div className="flex flex-col">
            {/* Tabs */}
            <div className="flex mb-6 border-b border-gray-200">
              <button
                onClick={() => setActiveTab("front")}
                className={`py-3 px-6 text-sm font-semibold uppercase tracking-wide ${
                  activeTab === "front"
                    ? "text-black border-b-2 border-black"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Front Image
              </button>
              <button
                onClick={() => setActiveTab("back")}
                className={`py-3 px-6 text-sm font-semibold uppercase tracking-wide ${
                  activeTab === "back"
                    ? "text-black border-b-2 border-black"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Back Image
              </button>
            </div>

            {/* ChatGPT-style Prompt Box */}
            <div className="mb-8">
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
                  className="w-full bg-transparent outline-none resize-none text-base placeholder-gray-400 text-gray-800 leading-relaxed flex-1 min-h-[200px] pr-4 mb-4"
                  placeholder={`Enter prompt for ${activeTab} image… `}
                  value={currentTab.prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  style={{ maxHeight: "400px" }}
                />

                {/* Action Buttons Inside Prompt Box */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <button
                    className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2.5 rounded-full transition-all duration-200 cursor-pointer font-medium text-sm"
                    onClick={() =>
                      document.getElementById("image-upload")?.click()
                    }
                    type="button"
                  >
                    <Paperclip size={18} className="text-gray-600" />
                    <span>ATTACH</span>
                  </button>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="image-upload"
                  />

                  <Button
                    className="!bg-blue-900 hover:!bg-blue-800 text-white px-6 py-2.5 rounded-full font-semibold text-sm max-w-[140px] flex items-center justify-center gap-2"
                    onClick={handleRegenerate}
                    variant="primary"
                    disabled={isGenerating}
                    type="button"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      "REGENERATE"
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Additional Variants Section */}
            {additionalVariants.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Additional Variants (Click to use)
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  {additionalVariants.map((variant) => (
                    <div
                      key={variant.id}
                      className="relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105 ring-2 ring-gray-200 hover:ring-yellow-300"
                      onClick={() => handleSelectAdditionalVariant(variant.url)}
                    >
                      <Image
                        src={variant.url}
                        alt="Additional Variant"
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                      {/* Remove Icon */}
                      <button
                        onClick={(e) =>
                          handleRemoveAdditionalVariant(variant.id, e)
                        }
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition"
                        title="Remove variant"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-sm text-gray-500 leading-relaxed mt-4">
              <p className="uppercase tracking-wide">
                Each tab shows one image. Use the regenerate button to create a
                new version for the current tab.
              </p>
            </div>
          </div>

          {/* Right Section - Preview */}
          <div className="flex flex-col">
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-lg aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-xl relative">
                {currentTab.image ? (
                  <>
                    <Image
                      src={currentTab.image.url}
                      alt={`${activeTab} Preview`}
                      width={600}
                      height={600}
                      className="w-full h-full object-cover"
                    />
                    {/* Remove Icon on Preview */}
                    <button
                      onClick={handleRemoveCurrentImage}
                      className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition shadow-lg"
                      title="Remove this image"
                    >
                      <X size={18} />
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🪙</div>
                      <div className="text-lg font-medium">
                        No {activeTab} design selected
                      </div>
                      <div className="text-sm">Upload an image to preview</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between gap-6 mt-8">
              {isLoggedIn && (
                <Button
                  type="button"
                  variant="ternary"
                  onClick={handleSaveDraft}
                  className="max-w-[180px] w-full text-md font-base !bg-gray-200 border-none"
                >
                  SAVE AS DRAFT
                </Button>
              )}

              <Button
                onClick={handleContinueClick}
                type="button"
                variant="primary"
                className="max-w-[180px] w-full text-lg font-medium"
                disabled={!front.image || !back.image}
              >
                CONTINUE
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinDesignInterface;
