"use client";
import React, { useState } from "react";
import ImageUpload from "../common/imageUpload";
import Button from "../common/button/Button";
import { z } from "zod";
import { toast } from "react-toastify";
import { useGenerateCompleteCoin } from "@/src/hooks/useQueries";
import { useCoinDesignStore } from "@/src/store/useCoinStore";

interface CoinUploadScreenProps {
  onFileChange: (file: File | null) => void;
  image: File | null;
  onGenerate: (generatedImages: string[]) => void;
}

const imageSchema = z.instanceof(File, { message: "Please upload an image" });

const CoinUploadScreen: React.FC<CoinUploadScreenProps> = ({
  onFileChange,
  image,
  onGenerate,
}) => {
  const [error, setError] = useState<string | undefined>(undefined);
  const { setDesignId, setFrontImage, setBackImage } = useCoinDesignStore();

  const { mutate: generateCompleteCoinMutate, isPending } =
    useGenerateCompleteCoin({
      onSuccess: (res) => {
        console.log("Complete Coin API Response:", res);

        if (res.success && res.data) {
          const { designId, front, back } = res.data;

          toast.success("Both sides generated successfully! 🎉");
          setError(undefined);

          // Store design ID for later use
          setDesignId(designId);

          // Create data URIs from base64 strings
          const frontImageUrl = `data:image/png;base64,${front.imageBase64}`;
          const backImageUrl = `data:image/png;base64,${back.imageBase64}`;

          // Set both front and back images in the store
          setFrontImage(frontImageUrl);
          setBackImage(backImageUrl);

          // Navigate to design interface with both generated images
          onGenerate([frontImageUrl, backImageUrl]);
        } else {
          console.error("Invalid response from Complete Coin API:", res);
          toast.error("Failed to process images from API");
        }
      },
      onError: (error) => {
        console.error("Complete Coin API Error:", error);
        setError("Failed to generate coin. Please try again.");
        toast.error("Failed to generate coin.");
      },
    });

  const handleGenerateClick = () => {
    const validation = imageSchema.safeParse(image);
    if (validation.success && image) {
      // Generate BOTH sides from uploaded image in a single call! 🚀
      generateCompleteCoinMutate({
        image: image,
      });
    } else {
      setError(validation.error?.issues[0].message);
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
          Upload an image to generate a coin.
        </p>
        <Button
          onClick={handleGenerateClick}
          type="button"
          variant="primary"
          className="mt-6 max-w-[200px] w-full text-xl font-medium items-center justify-center flex mx-auto"
          disabled={isPending}
        >
          {isPending ? "Uploading..." : "GENERATE"}
        </Button>
      </div>
    </div>
  );
};

export default CoinUploadScreen;
