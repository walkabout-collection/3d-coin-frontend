"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { ImageUploadProps } from "./types";

const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  value,
  error,
  className,
  id,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Allowed file types
  const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];
  const ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg"];

  useEffect(() => {
    if (value) {
      if (value instanceof File) {
        const url = URL.createObjectURL(value);
        setPreviewUrl(url);
        return () => {
          URL.revokeObjectURL(url);
        };
      } else if (typeof value === "string") {
        setPreviewUrl(value);
      }
    } else {
      setPreviewUrl(null);
    }
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: File | null =
      e.target.files && e.target.files[0] ? e.target.files[0] : null;
    processFile(file);
  };

  const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(null);
    // Reset the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Validate and process file
  const processFile = (file: File | null) => {
    setFileError(null);

    if (!file) {
      onChange(null);
      return;
    }

    // Validate file type
    const isValidType =
      ALLOWED_TYPES.includes(file.type) ||
      ALLOWED_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!isValidType) {
      setFileError("Only PNG and JPG images are allowed");
      onChange(null);
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    onChange(file);
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  return (
    <div className="mb-4">
      <div
        ref={dropZoneRef}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-xl p-8 text-center bg-gray-100 hover:bg-gray-50 border-2 border-dashed transition-all duration-200 ${
          isDragging
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-gray-300 hover:border-primary"
        } ${className}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,.png,.jpg,.jpeg"
          onChange={handleFileChange}
          className="hidden"
          id={id}
        />

        {previewUrl ? (
          <div className="relative flex flex-col items-center">
            {/* Close Button */}
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 z-10 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group"
              title="Remove image"
              aria-label="Remove image"
            >
              <X className="h-4 w-4 group-hover:scale-110 transition-transform" />
            </button>

            {/* Image Preview */}
            <div className="relative flex flex-col items-center h-48 w-48 group">
              <Image
                src={previewUrl}
                alt="Uploaded Preview"
                width={300}
                height={200}
                className="object-contain max-h-full max-w-full rounded-lg"
              />
              {/* Overlay on hover to show it's clickable */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 rounded-lg transition-colors duration-200 pointer-events-none" />
            </div>

            {/* File Name */}
            {value && value instanceof File && (
              <p className="mt-3 text-sm text-gray-600 font-medium truncate max-w-full px-2">
                {value.name}
              </p>
            )}

            {/* Click to change text */}
            <label
              htmlFor={id}
              className="mt-2 text-xs text-primary hover:text-primary/80 cursor-pointer underline transition-colors"
            >
              Click to change image
            </label>
          </div>
        ) : (
          <label
            htmlFor={id}
            className="cursor-pointer h-full flex flex-col items-center justify-center min-h-[200px]"
          >
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm hover:shadow-md transition-shadow">
                <Image
                  src="/images/home/upload-icon.svg"
                  alt="Upload"
                  width={32}
                  height={32}
                  className="opacity-60"
                />
              </div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                Upload Image
              </p>
              <p className="text-xs text-gray-500 mb-1">
                Click or drag to upload
              </p>
              <p className="text-xs text-gray-400 italic">PNG and JPG only</p>
            </div>
          </label>
        )}
      </div>
      {(error || fileError) && (
        <div className="mt-2 text-red-500 text-sm flex items-center gap-1">
          <span>{error || fileError}</span>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
