"use client";
import React, { useState, useEffect, useCallback } from "react";
import Button from "../common/button/Button";
import { Paperclip, XCircle, AlertCircle } from "lucide-react";
import Image from "next/image";
import ChatbotDrawer from "./ChatbotDrawer";
import { chatbotQuestions, initialChatbotState } from "./data";
import { toast } from "react-toastify";
import {
  useGenerateCompleteCoin,
  useGenerateCoinDesign,
  useGenerationStatus,
  useCancelGeneration,
} from "@/src/hooks/useQueries";
import { useCoinDesignStore } from "@/src/store/useCoinStore";
import { validateAIGenerationInput } from "@/src/utils/validation";
import RequestQueue from "@/src/components/common/RequestQueue";

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
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);

  // Queue-based generation hooks
  const generateMutation = useGenerateCoinDesign({
    onSuccess: (data) => {
      if (data.success && data.data?.requestId) {
        setCurrentRequestId(data.data.requestId);
        toast.success("Generation request queued successfully");
      }
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "object" &&
              error !== null &&
              "response" in error &&
              typeof error.response === "object" &&
              error.response !== null &&
              "status" in error.response &&
              error.response.status === 429
            ? "Too many requests. Please try again later."
            : "Failed to start generation";
      setError({ message: errorMessage });
      toast.error(errorMessage);
    },
  });

  const { data: status } = useGenerationStatus(
    currentRequestId,
    !!currentRequestId,
  );

  const cancelMutation = useCancelGeneration({
    onSuccess: () => {
      setCurrentRequestId(null);
      toast.success("Generation cancelled");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to cancel generation";
      toast.error(errorMessage);
    },
  });

  // Legacy API hook (keep for backward compatibility)
  const { mutate: generateCompleteCoinMutate, isPending: isGeneratingLegacy } =
    useGenerateCompleteCoin({
      onSuccess: (res) => {
        console.log("Complete Coin API Response:", res);

        if (res.success && res.data) {
          const { designId, front, back } = res.data;

          toast.success("Generated successfully!");
          setError(undefined);

          setDesignId(designId);

          const frontImageUrl = `data:image/png;base64,${front.imageBase64}`;
          const backImageUrl = `data:image/png;base64,${back.imageBase64}`;

          setFrontImage(frontImageUrl);
          setBackImage(backImageUrl);

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

    if (!prompt.trim() && !uploadedFile && !previewImage) {
      setError({ message: "Please provide a prompt or upload an image." });
      return;
    }

    // Use queue-based API for new implementation
    try {
      await generateMutation.mutateAsync({
        prompt: prompt.trim() || undefined,
        imageFile: uploadedFile,
        imageUrl: undefined,
      });
    } catch {
      // Error handled by mutation
    }

    // Keep legacy API as fallback (commented out, can be enabled if needed)
    // let fileToSend: File | undefined;
    // if (uploadedFile) {
    //   fileToSend = uploadedFile;
    // } else if (previewImage && previewImage.startsWith("data:")) {
    //   fileToSend = base64ToFile(previewImage, "preview.png");
    // }
    // generateCompleteCoinMutate({
    //   prompt: prompt.trim() || undefined,
    //   image: fileToSend,
    // });
  };

  const handleCancel = async () => {
    if (!currentRequestId) return;
    try {
      await cancelMutation.mutateAsync(currentRequestId);
    } catch {
      // Error handled by mutation
    }
  };

  // Check if generation is in progress
  const isGenerating =
    generateMutation.isPending ||
    status?.data?.status === "QUEUED" ||
    status?.data?.status === "PROCESSING";
  const isCompleted = status?.data?.status === "COMPLETED";
  const isFailed = status?.data?.status === "FAILED";

  // Show result when completed
  useEffect(() => {
    if (isCompleted && status?.data?.designId) {
      toast.success("Generation completed!");
      // TODO: Handle design display - may need to fetch design data
      setCurrentRequestId(null);
    }
  }, [isCompleted, status?.data?.designId]);

  // Show error when failed
  useEffect(() => {
    if (isFailed && status?.data?.error) {
      toast.error(`Generation failed: ${status.data.error}`);
      setCurrentRequestId(null);
    }
  }, [isFailed, status?.data?.error]);

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

          {/* Request Queue */}
          <div className="mb-4 max-w-3xl mx-auto">
            <RequestQueue />
          </div>

          {/* Generation Status */}
          {status?.data && (
            <div
              className={`mb-4 max-w-3xl mx-auto p-4 rounded-lg ${
                status.data.status === "COMPLETED"
                  ? "bg-green-50 border border-green-200"
                  : status.data.status === "FAILED"
                    ? "bg-red-50 border border-red-200"
                    : "bg-blue-50 border border-blue-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <strong className="text-sm">Status:</strong>{" "}
                  <span className="text-sm">{status.data.status}</span>
                  {status.data.queuePosition && (
                    <span className="ml-2 text-sm">
                      (Position: #{status.data.queuePosition})
                    </span>
                  )}
                </div>
                {(status.data.status === "QUEUED" ||
                  status.data.status === "PROCESSING") && (
                  <Button
                    variant="ternary"
                    onClick={handleCancel}
                    disabled={cancelMutation.isPending}
                    className="text-xs !px-3 !py-1"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          )}

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
                    disabled={
                      isGenerating ||
                      isGeneratingLegacy ||
                      validationErrors.length > 0
                    }
                  >
                    {isGenerating || isGeneratingLegacy ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>
                          {status?.data?.status === "QUEUED"
                            ? "Queued..."
                            : status?.data?.status === "PROCESSING"
                              ? "Processing..."
                              : "Processing..."}
                        </span>
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
