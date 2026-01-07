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

          toast.success("Generated successfully!");
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // If Enter is pressed without Shift, trigger generate
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default new line
      handleGenerateClick();
    }
    // Shift+Enter will allow new line (default behavior)
  };

  return (
    <div className="relative">
      <div className="py-16 min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4">
          {/* Title */}
          <h2 className="text-center text-4xl md:text-5xl font-serif text-gray-900 mb-12 mt-8 leading-tight">
            START YOUR JOURNEY OF
            <br />
            COLLECTING UNIQUE COINS, ONE
            <br />
            POCKET AT A TIME
          </h2>

          {/* Prompt Box Container */}
          <div className="relative max-w-3xl mx-auto">
            {/* Yellow Border Box */}
            <div className="relative w-full border-2 border-yellow-400 rounded-xl p-6 bg-white shadow-sm">
              {/* Preview Image */}
              {previewImage && (
                <div className="mb-4">
                  <Image
                    src={previewImage}
                    alt="Attached Preview"
                    width={80}
                    height={80}
                    className="object-cover rounded-lg border border-gray-300 shadow-sm"
                  />
                </div>
              )}

              {/* Textarea */}
              <textarea
                className="w-full bg-transparent outline-none resize-none text-base placeholder-gray-400 text-gray-800 leading-relaxed pr-4"
                placeholder="Enter your prompt here... (Press Enter to generate, Shift+Enter for new line)"
                rows={6}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{ minHeight: "120px", maxHeight: "300px" }}
              />

              {/* Action Buttons Container */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                {/* Attach Button - Left */}
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

                {/* Generate Button with AI Icon - Right */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleChatbotClick}
                    className="hover:opacity-80 transition-opacity duration-200 p-1"
                    type="button"
                    aria-label="AI Assistant"
                  >
                    <Image
                      src="/images/home/bot-icon.svg"
                      alt="Chatbot Assistant"
                      width={40}
                      height={40}
                      className="cursor-pointer"
                    />
                  </button>

                  <Button
                    onClick={handleGenerateClick}
                    type="button"
                    variant="primary"
                    className="!bg-blue-900 hover:!bg-blue-800 text-white px-6 py-2.5 rounded-full font-semibold text-sm min-w-[140px] flex items-center justify-center gap-2"
                    disabled={isGenerating}
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

            {/* Error Message */}
            {error && (
              <div
                className="mt-4 text-red-500 text-sm text-center"
                aria-live="polite"
              >
                <span>{error.message}</span>
              </div>
            )}
          </div>
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
