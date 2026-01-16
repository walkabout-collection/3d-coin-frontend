"use client";
import React, { useState, useCallback } from "react";
import Button from "../common/button/Button";
import { Paperclip, AlertCircle } from "lucide-react";
import Image from "next/image";
import ChatbotDrawer from "./ChatbotDrawer";
import { chatbotQuestions, initialChatbotState } from "./data";
import { toast } from "react-toastify";
import { useGenerateCompleteCoin } from "@/src/hooks/useQueries";
import { useCoinDesignStore } from "@/src/store/useCoinStore";
import { validateAIGenerationInput } from "@/src/utils/validation";

interface CoinPromptBoxProps {
  onGenerate?: (variants?: string[]) => void;
}

interface ChatbotState {
  isDrawerOpen: boolean;
}

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
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Generate Complete Coin API hook - generates both front and back sides in a single call
  const { mutate: generateCompleteCoinMutate, isPending: isGenerating } =
    useGenerateCompleteCoin({
      onSuccess: (res) => {
        console.log("Generate Complete Coin API Response:", res);

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

          // Call onGenerate callback with both images
          if (onGenerate) onGenerate([frontImageUrl, backImageUrl]);
        } else {
          console.error(
            "Invalid response from Generate Complete Coin API:",
            res,
          );
          toast.error("Failed to process images from API");
          setError({
            message: "Failed to process images from API. Please try again.",
          });
        }
      },
      onError: (error: unknown) => {
        console.error("Generate Complete Coin API Error:", error);

        // Extract error message from various error formats
        const errorMessage =
          error instanceof Error
            ? error.message
            : typeof error === "object" &&
                error !== null &&
                "response" in error &&
                typeof error.response === "object" &&
                error.response !== null &&
                "data" in error.response &&
                typeof error.response.data === "object" &&
                error.response.data !== null &&
                "error" in error.response.data &&
                typeof error.response.data.error === "object" &&
                error.response.data.error !== null &&
                "message" in error.response.data.error
              ? String(error.response.data.error.message)
              : typeof error === "object" &&
                  error !== null &&
                  "response" in error &&
                  typeof error.response === "object" &&
                  error.response !== null &&
                  "status" in error.response &&
                  error.response.status === 429
                ? "Too many requests. Please try again later."
                : "Failed to generate coin. Please try again.";

        setError({ message: errorMessage });
        toast.error(errorMessage);
      },
    });

  // Validate inputs
  const handleValidate = useCallback(async () => {
    const validation = await validateAIGenerationInput(
      prompt,
      uploadedFile,
      undefined, // No imageUrl in this component
    );
    setValidationErrors(validation.errors);
    return validation.isValid;
  }, [prompt, uploadedFile]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file immediately
      const validation = await validateAIGenerationInput(
        prompt,
        file,
        undefined,
      );
      setValidationErrors(validation.errors);

      if (validation.isValid) {
        setUploadedFile(file);
        const imageUrl = URL.createObjectURL(file);
        setPreviewImage(imageUrl);
        setError(undefined);
      } else {
        toast.error(validation.errors[0] || "Invalid file");
        // Reset file input
        e.target.value = "";
      }
    } else {
      setUploadedFile(null);
      setPreviewImage(null);
      setValidationErrors([]);
    }
  };

  const handleGenerateClick = async () => {
    // Validate before submission
    const isValid = await handleValidate();
    if (!isValid) {
      toast.error("Please fix validation errors");
      return;
    }

    // At least one input is required: prompt, image file, or image URL
    if (!prompt.trim() && !uploadedFile && !previewImage) {
      setError({ message: "Please provide a prompt or upload an image." });
      return;
    }

    // Prepare request data for Generate Complete Coin API
    // The API accepts: prompt (optional), imageUrl (optional), image (File, optional)
    // At least one must be provided (already validated above)
    const requestData: {
      prompt?: string;
      imageUrl?: string;
      image?: File;
    } = {};

    // Add prompt if provided
    if (prompt.trim()) {
      requestData.prompt = prompt.trim();
    }

    // Add image file if uploaded
    if (uploadedFile) {
      requestData.image = uploadedFile;
    }
    // Note: imageUrl is not currently supported in this component's UI
    // but can be added later if needed

    // Call Generate Complete Coin API
    // This will generate BOTH front and back sides in a single API call
    generateCompleteCoinMutate(requestData);
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

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="mb-4 max-w-3xl mx-auto p-4 bg-red-50 border border-red-200 rounded-lg">
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
                placeholder="Enter your prompt here... (10-1000 characters) (Press Enter to generate, Shift+Enter for new line)"
                rows={6}
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  setValidationErrors([]);
                }}
                onBlur={handleValidate}
                onKeyDown={handleKeyDown}
                maxLength={1000}
                style={{ minHeight: "120px", maxHeight: "300px" }}
              />
              <div className="text-xs text-gray-500 mt-1 text-right">
                {prompt.length}/1000 characters
              </div>

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
                  accept="image/jpeg,image/jpg,image/png,image/webp"
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
                    disabled={isGenerating || validationErrors.length > 0}
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Generating...</span>
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
