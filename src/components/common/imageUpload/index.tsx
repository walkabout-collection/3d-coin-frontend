import React from 'react';
import Image from 'next/image';
import { ImageUploadProps } from './types';

const ImageUpload: React.FC<ImageUploadProps> = ({  onChange, value, error,  className}) => {
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
          id="image-upload"
        />
        <label htmlFor="image-upload" className="cursor-pointer h-full flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Image
              src="/images/home/upload-icon.svg"
              alt="Upload"
              width={48}
              height={48}
              className="mb-2 opacity-50"
            />
            <p className="text-sm text-gray-500 mb-1">Upload Image</p>
          </div>
        </label>
        {value && (
          <p className="mt-2 text-sm text-green-600">
            Image selected: {(value as File)?.name}
          </p>
        )}
      </div>
      {error && (
        <div className="mt-1 text-red-500 text-sm">
          <span>{error.message as string}</span>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;