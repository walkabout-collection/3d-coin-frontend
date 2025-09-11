"use client";
import React, { useState } from "react";
import Image from "next/image";
import Button from "../common/button/Button";
import { buttonTexts } from "./data";
import { ThreeDRenderProps } from "./types";

export const ThreeDRender: React.FC<ThreeDRenderProps> = ({
  frontImage = "/images/home/front-side.png",
  backImage = "/images/home/front-side.png",
  title = "AI Generated 3D Render",
  onSaveAsDraft,
  onContinue,
  loading = false,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [frontImageLoaded, setFrontImageLoaded] = useState(false);
  const [backImageLoaded, setBackImageLoaded] = useState(false);
  const [frontImageError, setFrontImageError] = useState(false);
  const [backImageError, setBackImageError] = useState(false);

  const handleSaveAsDraft = async () => {
    if (onSaveAsDraft) {
      setIsProcessing(true);
      try {
        await onSaveAsDraft();
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleContinue = async () => {
    if (onContinue) {
      setIsProcessing(true);
      try {
        await onContinue();
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white min-h-screen py-16">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 tracking-wide">
          {title}
        </h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <div className="flex flex-col w-full items-center">
          <h3 className="text-md text-start font-semibold text-gray-800  tracking-wide uppercase">
            Front Design
          </h3>
          <div className="relative flex items-center justify-center w-full max-w-[500px] h-[400px] ">
            {!frontImageLoaded && !frontImageError && (
              <div className="animate-pulse text-gray-400">Loading...</div>
            )}
            <Image
              src={frontImageError ? "/images/home/front-side.png" : frontImage}
              alt="Front coin render"
              fill
              className={`object-contain transition-all duration-500 ${
                frontImageLoaded
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95"
              }`}
              onLoadingComplete={() => setFrontImageLoaded(true)}
              onError={() => {
                setFrontImageError(true);
                setFrontImageLoaded(false);
              }}
            />
          </div>
        </div>
        <div className="flex flex-col w-full items-center">
          <h3 className="text-md font-semibold text-gray-800  tracking-wide uppercase">
            Back Design
          </h3>
          <div className="relative flex items-center justify-center w-full max-w-[500px] h-[400px]">
            {!backImageLoaded && !backImageError && (
              <div className="animate-pulse text-gray-400">Loading...</div>
            )}
            <Image
              src={backImageError ? "/images/home/front-side.png" : backImage}
              alt="Back coin render"
              fill
              className={`object-contain transition-all duration-500 ${
                backImageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
              onLoadingComplete={() => setBackImageLoaded(true)}
              onError={() => {
                setBackImageError(true);
                setBackImageLoaded(false);
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center space-x-6">
        <Button
          type="button"
          variant="ternary"
          onClick={handleSaveAsDraft}
          disabled={loading || isProcessing}
          className={`
            max-w-[180px] w-full text-md font-base !bg-gray-200 border-none min-w-[140px]
            ${loading || isProcessing ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          {isProcessing && !onContinue ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              <span>{buttonTexts.loading}</span>
            </div>
          ) : (
            buttonTexts.saveAsDraft
          )}
        </Button>

        <Button
          type="button"
          variant="primary"
          onClick={handleContinue}
          disabled={loading || isProcessing}
          className={`
            rounded-full font-base text-md max-w-[140px]
            ${loading || isProcessing ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          {isProcessing && onContinue ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              <span>{buttonTexts.loading}</span>
            </div>
          ) : (
            buttonTexts.continue
          )}
        </Button>
      </div>
    </div>
  );
};

export default ThreeDRender;
