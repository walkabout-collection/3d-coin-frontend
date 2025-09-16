"use client";
import React, { useState } from "react";
import Button from "../common/button/Button";
import { Paperclip } from "lucide-react";
import Image from "next/image";
import ChatbotDrawer from "./ChatbotDrawer";
import { chatbotQuestions, initialChatbotState } from "./data";
import { z } from "zod";

interface CoinPromptBoxProps {
  onGenerate: () => void;
}

const imageSchema = z.instanceof(File, { message: "Please upload an image" });

const CoinPromptBox: React.FC<CoinPromptBoxProps> = ({ onGenerate }) => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [chatbotState, setChatbotState] = useState(initialChatbotState);
  const [error, setError] = useState<{ message: string } | undefined>(
    undefined
  );
  const [prompt, setPrompt] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setError(undefined);
    } else {
      setUploadedImage(null);
      setPreviewImage(null);
    }
  };

  const handleChatbotClick = () => {
    setChatbotState((prev: { isDrawerOpen: any }) => ({
      ...prev,
      isDrawerOpen: !prev.isDrawerOpen,
    }));
  };

  const handleGenerateClick = () => {
    const validation = imageSchema.safeParse(uploadedImage);
    if (prompt.trim().length > 0 || (validation.success && uploadedImage)) {
      setError(undefined);
      onGenerate();
    } else {
      setError({
        message: "Please provide a prompt or upload an image to generate.",
      });
    }
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
                  <img
                    src={previewImage}
                    alt="Attached Preview"
                    className="w-16 h-16 object-cover rounded-md border border-gray-300 shadow"
                  />
                </div>
              )}

              {/* Textarea */}
              <textarea
                className="w-full bg-transparent outline-none resize-none text-lg placeholder-gray-400"
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
                >
                  GENERATE
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
