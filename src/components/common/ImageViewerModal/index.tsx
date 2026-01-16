"use client";
import React, { useEffect } from "react";
import { X, ZoomIn } from "lucide-react";
import Image from "next/image";

interface ImageViewerModalProps {
  imageUrl: string;
  alt: string;
  title?: string;
  onClose: () => void;
}

const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
  imageUrl,
  alt,
  title,
  onClose,
}) => {
  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[95vh] relative transform transition-all animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1a2a3a] rounded-lg flex items-center justify-center">
              <ZoomIn className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {title || "Image Viewer"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 cursor-pointer"
            title="Close (ESC)"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Image Container */}
        <div className="flex-1 p-6 overflow-auto flex items-center justify-center bg-gray-50">
          <div className="relative w-full h-full max-w-5xl max-h-[80vh] flex items-center justify-center">
            <Image
              src={imageUrl}
              alt={alt}
              width={1200}
              height={1200}
              className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-lg shadow-lg"
              priority
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/images/home/coin-design.png";
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
          <p className="text-xs text-gray-500 text-center">
            Press ESC or click outside to close
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageViewerModal;
