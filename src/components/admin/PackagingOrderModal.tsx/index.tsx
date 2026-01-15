"use client";
import React, { useEffect } from "react";
import { X, Package, FileText } from "lucide-react";

interface PackagingModalProps {
  packagingDescription: string;
  onClose: () => void;
  backText: string;
}

const PackagingModal: React.FC<PackagingModalProps> = ({
  packagingDescription,
  onClose,
  backText,
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
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto transform transition-all animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1a2a3a] rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Packaging Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Package className="h-4 w-4 text-gray-600" />
              <label className="text-sm font-semibold text-gray-900">
                Packaging Description
              </label>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-900 leading-relaxed">
                {packagingDescription}
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-gray-600" />
              <label className="text-sm font-semibold text-gray-900">
                Back Text
              </label>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-900 leading-relaxed">
                {backText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackagingModal;
