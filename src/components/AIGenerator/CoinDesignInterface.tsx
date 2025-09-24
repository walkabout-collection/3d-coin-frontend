"use client";
import React, { useState } from "react";
import { Paperclip } from "lucide-react";
import Button from "../common/button/Button";
import Image from "next/image";
import { toast } from "react-toastify";
import { useGenerateFromPrompt } from "@/src/hooks/useQueries";
import { z } from "zod";

interface UIState {
  previewImage: string | null;
  selectedThumbnail: number | null;
  isLoggedIn: boolean;
}

interface ImageData {
  file: File | null;
}

interface CoinDesignInterfaceProps {
  onContinue: () => void;
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
  const [uploadedImages, setUploadedImages] = useState<string[]>(variants);
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState<{ message: string } | undefined>(undefined);

  const { mutate: generateFromPromptMutate, isPending: isGenerating } = useGenerateFromPrompt({
    onSuccess: (data) => {
      toast.success("Generated successfully!");
      setError(undefined);
      setUploadedImages((prev) => {
        const newImages = [...prev, ...(data.variants || [])];
        return newImages.slice(-4); 
      });
      setState((prev) => ({
        ...prev,
        previewImage: data.variants?.[0] || prev.previewImage,
        selectedThumbnail: data.variants?.length ? uploadedImages.length : prev.selectedThumbnail,
      }));
    },
    onError: () => {
      setError({ message: "Failed to generate from prompt. Please try again." });
      toast.error("Failed to generate from prompt.");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImages((prev) => {
        const newImages = [...prev, imageUrl];
        return newImages.slice(-4); 
      });
      setState((prev) => ({
        ...prev,
        previewImage: imageUrl,
        selectedThumbnail: uploadedImages.length,
      }));
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

  const handleGenerate = () => {
    const validation = imageSchema.safeParse(imageData.file);
    if (prompt.trim().length > 0 || validation.success) {
      setError(undefined);
      generateFromPromptMutate({
        prompt,
        imageUrl: imageData.file ? URL.createObjectURL(imageData.file) : undefined,
      });
    } else {
      setError({
        message: "Please provide a prompt or upload an image to generate.",
      });
      toast.error("Please provide a prompt or upload an image.");
    }
  };

  const handleSaveDraft = () => {
    alert("Design saved as draft!");
  };

  return (
    <div className="min-h-screen">
      <div className="p-6 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Section - Input Area */}
          <div className="flex flex-col">
            <div className="relative mb-8">
              <div className="w-full border-2 border-yellow-500 shadow-lg shadow-yellow-400/20 rounded-xl p-4 text-left">
                {state.previewImage && (
                  <div className="mb-3">
                    <Image
                      src={state.previewImage}
                      alt="Attached Preview"
                      width={64}
                      height={64}
                      className="object-cover rounded-md border border-gray-300 shadow"
                    />
                  </div>
                )}
                <textarea
                  className="w-full bg-transparent outline-none resize-none text-lg placeholder-gray-400"
                  placeholder="Ask anything…"
                  rows={10}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                <button
                  className="flex items-center gap-2 bg-gray-200 hover:bg-yellow-400 hover:text-black text-gray-700 px-4 py-2 rounded-full transition-all duration-300 cursor-pointer"
                  onClick={() => document.getElementById("image-upload")?.click()}
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
                  {isGenerating ? "Processing..." : "GENERATE"}
                </Button>
              </div>
            </div>

            {/* Thumbnail Images Section */}
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                {uploadedImages.map((imageUrl, index) => (
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
                      alt={`Thumbnail ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              <div className="text-sm text-gray-500 leading-relaxed">
                <p className="uppercase tracking-wide">
                  Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry standard
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
                    alt="Preview"
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🪙</div>
                      <div className="text-lg font-medium">
                        No design selected
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
                onClick={onContinue}
                type="button"
                variant="primary"
                className="max-w-[180px] w-full text-lg font-medium"
              >
                CONTINUE
              </Button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-1 text-red-500 text-sm text-center" aria-live="polite">
          <span>{error.message}</span>
        </div>
      )}
    </div>
  );
};

export default CoinDesignInterface;