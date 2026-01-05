"use client";
import React, { useState, useEffect } from "react";
import { Paperclip } from "lucide-react";
import Button from "../common/button/Button";
import Image from "next/image";
import { toast } from "react-toastify";
import { useUploadImage } from "@/src/hooks/useQueries";
import { z } from "zod";
import { useDesignCoinStore, useCoinStore } from "@/src/store/useCoinStore";

interface UIState {
  previewImage: string | null;
  selectedThumbnail: number | null;
  isLoggedIn: boolean;
}

interface ImageData {
  file: File | null;
}

interface CoinDesignInterfaceProps {
  onContinue: (frontImages: string[], backImages: string[]) => void;
  variants?: string[];
}

const initialUIState: UIState = {
  previewImage: null,
  selectedThumbnail: null,
  isLoggedIn: true,
};

const imageSchema = z.instanceof(File, { message: "Please upload an image" });

const CoinDesignInterface: React.FC<CoinDesignInterfaceProps> = ({
  onContinue,
  variants = [],
}) => {
  const [state, setState] = useState<UIState>(initialUIState);
  const [imageData, setImageData] = useState<ImageData>({ file: null });
  const [activeTab, setActiveTab] = useState<"front" | "back">("front");
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState<{ message: string } | undefined>(
    undefined,
  );
  const { frontImages, backImages, addFrontImage, addBackImage } =
    useDesignCoinStore();
  const { coinImages } = useCoinStore();

  // If an image was uploaded on the previous screen (stored in `coinImages`),
  // sync it into the design store so it appears in the preview/thumbnails.
  useEffect(() => {
    if (coinImages && coinImages.length > 0) {
      const first = coinImages[0];
      // only add if not already present
      if (first && !frontImages.includes(first)) {
        addFrontImage(first);
        setState((prev) => ({
          ...prev,
          previewImage: first,
          selectedThumbnail: frontImages.length,
        }));
      }
    }
  }, [coinImages]);

  const { mutate: uploadImageMutate, isPending: isGenerating } = useUploadImage(
    {
      onSuccess: (res) => {
        toast.success("Generated successfully!");
        setError(undefined);

        const file = res.data?.data?.buffer;
        if (file instanceof File) {
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result as string;
            if (activeTab === "front") {
              addFrontImage(base64);
              setState((prev) => ({
                ...prev,
                previewImage: base64,
                selectedThumbnail: frontImages.length,
              }));
            } else {
              addBackImage(base64);
              setState((prev) => ({
                ...prev,
                previewImage: base64,
                selectedThumbnail: backImages.length,
              }));
            }
          };
          reader.readAsDataURL(file);
        } else {
          console.error("No buffer returned from uploadImage API");
        }
      },
      onError: () => {
        setError({
          message: "Failed to generate from prompt. Please try again.",
        });
        toast.error("Failed to generate from prompt.");
      },
    },
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      if (activeTab === "front") {
        addFrontImage(imageUrl);
        setState((prev) => ({
          ...prev,
          previewImage: imageUrl,
          selectedThumbnail: frontImages.length,
        }));
      } else {
        addBackImage(imageUrl);
        setState((prev) => ({
          ...prev,
          previewImage: imageUrl,
          selectedThumbnail: backImages.length,
        }));
      }
      setImageData({ file });
      setError(undefined);
    }
  };

  const handleThumbnailClick = (imageUrl: string, index: number) => {
    setState((prev) => ({
      ...prev,
      previewImage: imageUrl,
      selectedThumbnail: index,
    }));
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

  const handleGenerate = () => {
    let fileToSend;
    if (state.previewImage) {
      fileToSend = base64ToFile(state.previewImage, `${activeTab}-preview.png`);
    }

    uploadImageMutate({
      image: fileToSend,
      prompt,
    });
  };

  const handleSaveDraft = () => {};

  const handleContinueClick = () => {
    if (frontImages.length === 0 || backImages.length === 0) {
      toast.error(
        "Please generate or upload both front and back images before continuing.",
      );
      return;
    }
    onContinue(frontImages, backImages);
  };

  const displayedImages = activeTab === "front" ? frontImages : backImages;

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

            <div className="relative mb-8">
              <div className="w-full border-2 border-yellow-500 shadow-lg shadow-yellow-400/20 rounded-xl p-4 text-left">
                {state.previewImage && (
                  <div className="mb-3">
                    <Image
                      src={state.previewImage}
                      alt={`${activeTab} Preview`}
                      width={64}
                      height={64}
                      className="object-cover rounded-md border border-gray-300 shadow"
                    />
                  </div>
                )}
                <textarea
                  className="w-full bg-transparent outline-none resize-none text-lg placeholder-gray-400"
                  placeholder={`Enter prompt for ${activeTab} image…`}
                  rows={10}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                <button
                  className="flex items-center gap-2 bg-gray-200 hover:bg-yellow-400 hover:text-black text-gray-700 px-4 py-2 rounded-full transition-all duration-300 cursor-pointer"
                  onClick={() =>
                    document.getElementById("image-upload")?.click()
                  }
                >
                  <Paperclip size={16} />
                  <span className="text-sm font-medium">Attach</span>
                </button>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="image-upload"
                />

                <Button
                  className="px-6 py-2 text-sm max-w-[140px] text-white"
                  onClick={handleGenerate}
                  variant="primary"
                  disabled={isGenerating}
                >
                  {isGenerating ? "Processing..." : "REGENERATE"}
                </Button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-1 text-red-500 text-sm" aria-live="polite">
                <span>{error.message}</span>
              </div>
            )}

            {/* Thumbnail Images Section */}
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                {displayedImages.map((imageUrl, index) => (
                  <div
                    key={index}
                    className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      state.selectedThumbnail === index
                        ? "ring-4 ring-yellow-400 shadow-lg"
                        : "ring-2 ring-gray-200 hover:ring-yellow-300"
                    }`}
                    onClick={() => handleThumbnailClick(imageUrl, index)}
                  >
                    <Image
                      src={imageUrl}
                      alt={`${activeTab} Thumbnail ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              <div className="text-sm text-gray-500 leading-relaxed">
                <p className="uppercase tracking-wide">
                  Lorem ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem ipsum has been the industry
                  standard
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - Preview */}
          <div className="flex flex-col">
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-lg aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-xl">
                {state.previewImage ? (
                  <Image
                    src={state.previewImage}
                    alt={`${activeTab} Preview`}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />
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
              <Button
                type="button"
                variant="ternary"
                onClick={handleSaveDraft}
                className="max-w-[180px] w-full text-md font-base !bg-gray-200 border-none"
              >
                SAVE AS DRAFT
              </Button>

              <Button
                onClick={handleContinueClick}
                type="button"
                variant="primary"
                className="max-w-[180px] w-full text-lg font-medium"
                disabled={frontImages.length === 0 || backImages.length === 0}
              >
                CONTINUE
              </Button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div
          className="mt-1 text-red-500 text-sm text-center"
          aria-live="polite"
        >
          <span>{error.message}</span>
        </div>
      )}
    </div>
  );
};

export default CoinDesignInterface;
