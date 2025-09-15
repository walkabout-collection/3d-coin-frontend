'use client';
import React, { useState } from 'react';
import ImageUpload from '../common/imageUpload';
import Button from '../common/button/Button';
import { z } from 'zod';

interface CoinUploadScreenProps {
  onFileChange: (file: File | null) => void;
  image: File | null;
  onGenerate: () => void;
}

const imageSchema = z.instanceof(File, { message: 'Please upload an image' });

const CoinUploadScreen: React.FC<CoinUploadScreenProps> = ({ onFileChange, image, onGenerate }) => {
  const [error, setError] = useState<string | undefined>(undefined); 
  const handleGenerateClick = () => {
    const validation = imageSchema.safeParse(image);
    if (validation.success) {
      setError(undefined);
      onGenerate();
    } else {
      setError(validation.error.issues[0].message); 
    }
  };

  return (
    <div className="py-16 min-h-screen text-center max-w-2xl mx-auto">
      <h2 className="text-4xl font-semibold mb-6 mt-8">
        START YOUR JOURNEY OF COLLECTING UNIQUE COINS, ONE POCKET AT A TIME
      </h2>
      <div className="mx-auto py-8">
        <ImageUpload
          onChange={onFileChange}
          value={image}
          error={error} 
          className="py-16"
          id="image"
        />
        <p className="text-sm text-gray-700 font-medium mt-8">
          LOREM IPSUM IS SIMPLY DUMMY TEXT OF THE PRINTING AND TYPESETTING INDUSTRY. LOREM IPSUM HAS BEEN THE
          INDUSTRY STANDARD
        </p>
        <Button
          onClick={handleGenerateClick}
          type="button"
          variant="primary"
          className="mt-6 max-w-[200px] w-full text-xl font-medium items-center justify-center flex mx-auto"
        >
          GENERATE
        </Button>
      </div>
    </div>
  );
};

export default CoinUploadScreen;