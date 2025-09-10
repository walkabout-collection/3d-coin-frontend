'use client';
import React, { useState } from 'react';
import Image from 'next/image'; 
import Button from '../common/button/Button';
import { buttonTexts } from './data';
import { ThreeDRenderProps } from './types';

export const ThreeDRender: React.FC<ThreeDRenderProps> = ({
  frontImage = '/images/home/gallery1.png', 
  backImage = '/images/home/gallery2.png',   
  title = 'AI Generated 3D Render',
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
    <div className="max-w-7xl mx-auto p-8 bg-white min-h-screen py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 tracking-wide">{title}</h1>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 py-10">
        {/* Front Design */}
        <div className="flex flex-col w-full">
          <h3 className="text-lg font-semibold text-gray-800 mb-8 tracking-wide">FRONT DESIGN</h3>
          <div className="relative rounded-2xl p-8 shadow-2xl">
            <div className="relative z-10 flex items-center justify-center">
              {!frontImageLoaded && !frontImageError && (
                <div className="w-80 h-80 bg-gray-600 rounded-full animate-pulse flex items-center justify-center">
                  <div className="text-gray-400">Loading...</div>
                </div>
              )}
              <Image
                src={frontImageError ? '/images/home/gallery1.png' : frontImage} 
                alt="Front coin render"
                width={320} 
                height={320} 
                className={`object-contain rounded-full shadow-xl transition-all duration-500 ${
                  frontImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                onLoadingComplete={() => setFrontImageLoaded(true)}
                onError={() => {
                  setFrontImageError(true);
                  setFrontImageLoaded(false);
                }}
              />
            </div>
          </div>
        </div>

        {/* Back Design */}
        <div className="flex flex-col w-full">
          <h3 className="text-lg font-semibold text-gray-800 mb-8 tracking-wide">BACK DESIGN</h3>
          <div className="relative rounded-2xl max-h-[470px] bg-gray-100 shadow-xl">
            <div className="relative z-10 flex items-center justify-center">
              {!backImageLoaded && !backImageError && (
                <div className="max-w-[320px] max-h-[470px] bg-gray-600 rounded-full animate-pulse flex items-center justify-center">
                  <div className="text-gray-400">Loading...</div>
                </div>
              )}
              <Image
                src={backImageError ? '/images/home/military.png' : backImage}
                alt="Back coin render"
                width={320}
                height={320} 
                className={`object-contain rounded-full shadow-xl transition-all duration-500 ${
                  backImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                onLoadingComplete={() => setBackImageLoaded(true)}
                onError={() => {
                  setBackImageError(true);
                  setBackImageLoaded(false);
                }}
                style={{
                  filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-6 mt-10">
        <Button
          type="button"
          variant="ternary"
          onClick={handleSaveAsDraft}
          disabled={loading || isProcessing}
          className={`
            max-w-[180px] w-full text-md font-base !bg-gray-200 border-none min-w-[140px]
            ${(loading || isProcessing) ? 'opacity-50 cursor-not-allowed' : ''}
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
            ${(loading || isProcessing) ? 'opacity-50 cursor-not-allowed' : ''}
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
