'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ImageUploadProps } from './types';

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, value, error, className, id }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (value) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPreviewUrl(null);
    }
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    onChange(file || null);
  };

  return (
    <div className="mb-4">
      <div
        className={`rounded-xl p-8 text-center bg-gray-100 hover:border-primary transition-colors ${className}`}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id={id}
        />
        <label
          htmlFor={id}
          className="cursor-pointer h-full flex items-center justify-center"
        >
          {previewUrl ? (
            <div className="flex flex-col items-center h-48 w-48">
              <Image
                src={previewUrl}
                alt="Uploaded Preview"
                width={300}
                height={200}
                className="object-contain max-h-full max-w-full"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Image
                src="/images/home/upload-icon.svg"
                alt="Upload"
                width={48}
                height={48}
                className="mb-2"
              />
              <p className="text-sm text-gray-500 mb-1">Upload Image</p>
            </div>
          )}
        </label>
        {value && (
          <p className="mt-2 text-sm text-green-600">
            Image selected: {value.name}
          </p>
        )}
      </div>
      {error && (
        <div className="mt-1 text-red-500 text-sm">
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;