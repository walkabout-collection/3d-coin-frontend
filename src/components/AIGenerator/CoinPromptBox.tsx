"use client";
import React, { useState } from "react";
import Button from "../common/button/Button";
import { Paperclip } from "lucide-react";
import Image from "next/image";
import ChatbotDrawer from "./ChatbotDrawer";
import { chatbotQuestions, initialChatbotState } from "./data";
import { toast } from "react-toastify";
import { useGenerateCompleteCoin } from "@/src/hooks/useQueries";
import { useCoinDesignStore } from "@/src/store/useCoinStore";

interface CoinPromptBoxProps {
  onGenerate?: (variants?: string[]) => void;
}

interface ChatbotState {
  isDrawerOpen: boolean;
}

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

const CoinPromptBox: React.FC<CoinPromptBoxProps> = ({ onGenerate }) => {
  const { setDesignId, setFrontImage, setBackImage } = useCoinDesignStore();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [chatbotState, setChatbotState] =
    useState<ChatbotState>(initialChatbotState);
  const [error, setError] = useState<{ message: string } | undefined>(
    undefined,
  );
  const [prompt, setPrompt] = useState("");

  const { mutate: generateCompleteCoinMutate, isPending: isGenerating } =
    useGenerateCompleteCoin({
      onSuccess: (res) => {
        console.log("Complete Coin API Response:", res);

        if (res.success && res.data) {
          const { designId, front, back } = res.data;

          toast.success("Both sides generated successfully! 🎉");
          setError(undefined);

          // Store design ID for later use
          setDesignId(designId);

          // Create data URIs from base64 strings
          const frontImageUrl = `data:image/png;base64,${front.imageBase64}`;
          const backImageUrl = `data:image/png;base64,${back.imageBase64}`;

          // Set both front and back images in the store
          setFrontImage(frontImageUrl);
          setBackImage(backImageUrl);

          // Navigate to design interface with both images
          if (onGenerate) onGenerate([frontImageUrl, backImageUrl]);
        } else {
          console.error("Invalid response from Complete Coin API:", res);
          toast.error("Failed to process images from API");
        }
      },
      onError: (error) => {
        console.error("Complete Coin API Error:", error);
        setError({
          message: "Failed to generate coin. Please try again.",
        });
        toast.error("Failed to generate coin.");
      },
    });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setError(undefined);
    } else {
      setUploadedFile(null);
      setPreviewImage(null);
    }
  };

  const handleGenerateClick = () => {
    if (!prompt.trim() && !uploadedFile && !previewImage) {
      setError({ message: "Please provide a prompt or upload an image." });
      return;
    }

    let fileToSend: File | undefined;
    if (uploadedFile) {
      fileToSend = uploadedFile;
    } else if (previewImage && previewImage.startsWith("data:")) {
      fileToSend = base64ToFile(previewImage, "preview.png");
    }

    // Generate BOTH sides in a single API call! 🚀
    generateCompleteCoinMutate({
      prompt: prompt.trim() || undefined,
      image: fileToSend,
    });
  };

  const handleChatbotClick = () => {
    setChatbotState((prev) => ({ ...prev, isDrawerOpen: !prev.isDrawerOpen }));
  };

  const handleQuestionInsert = (question: string) => {
    setPrompt(question);
    setChatbotState({ ...chatbotState, isDrawerOpen: false });
  };

  return (
    <div className="relative">
      <div className="py-16 min-h-screen text-center max-w-2xl mx-auto">
        <h2 className="text-4xl font-semibold mb-6 mt-8">
          START YOUR JOURNEY OF COLLECTING UNIQUE COINS, ONE POCKET AT A TIME
        </h2>

        <div className="flex flex-col">
          <div className="relative mb-8 mt-10">
            <div className="w-full border-2 border-yellow-500 shadow-lg shadow-yellow-400/20 rounded-xl p-4 text-left">
              {previewImage && (
                <div className="mb-3">
                  <Image
                    src={previewImage}
                    alt="Attached Preview"
                    width={64}
                    height={64}
                    className="object-cover rounded-md border border-gray-300 shadow"
                  />
                </div>
              )}

              <textarea
                className="w-full bg-transparent outline-none  text-lg placeholder-gray-400"
                placeholder="Ask anything…"
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
              <button
                className="mt-5 flex items-center gap-2 bg-gray-200 hover:bg-yellow-400 hover:text-black text-gray-700 px-4 py-2 rounded-full transition-all duration-300 cursor-pointer"
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

              <div className="flex items-center gap-2">
                <button
                  onClick={handleChatbotClick}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  <Image
                    src="/images/home/bot-icon.svg"
                    alt="Chatbot Assistant"
                    width={48}
                    height={48}
                    className="cursor-pointer mt-5"
                  />
                </button>

                <Button
                  onClick={handleGenerateClick}
                  type="button"
                  variant="primary"
                  className="mt-5 max-w-[120px] w-full text-sm font-base items-center justify-center flex mx-auto"
                  disabled={isGenerating}
                >
                  {isGenerating ? "Processing..." : "GENERATE"}
                </Button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-1 text-red-500 text-sm" aria-live="polite">
              <span>{error.message}</span>
            </div>
          )}
        </div>
      </div>

      <ChatbotDrawer
        isOpen={chatbotState.isDrawerOpen}
        onClose={handleChatbotClick}
        questions={chatbotQuestions.questions}
        onQuestionClick={handleQuestionInsert}
      />
    </div>
  );
};

export default CoinPromptBox;
