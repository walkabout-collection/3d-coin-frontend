"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/src/components/common/button/Button";
import { Paperclip } from "lucide-react";
import { z } from "zod";
import ImageUpload from "@/src/components/common/imageUpload";

const ArtWork = () => {
 const [activeTab, setActiveTab] = useState<"front" | "back">("front");
   const [frontPrompt, setFrontPrompt] = useState("");
  const [backPrompt, setBackPrompt] = useState("");
  const [frontAttachedImage, setFrontAttachedImage] = useState<File | null>(null);
  const [backAttachedImage, setBackAttachedImage] = useState<File | null>(null);
  const [frontUploadedImage, setFrontUploadedImage] = useState<File | null>(null);
  const [backUploadedImage, setBackUploadedImage] = useState<File | null>(null);  
  const [frontPreviewImage, setFrontPreviewImage] = useState<string | null>(null);
  const [backPreviewImage, setBackPreviewImage] = useState<string | null>(null);
  const [error, setError] = useState<{ message: string } | undefined>(undefined);

  const router = useRouter();

  const imageSchema = z.instanceof(File, { message: "Please upload an image" });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: "front" | "back") => {
    const file = e.target.files?.[0];
    if (file) {
      if (side === "front") {
        setFrontAttachedImage(file);
        const imageUrl = URL.createObjectURL(file);
        setFrontPreviewImage(imageUrl);
      } else {
        setBackAttachedImage(file);
        const imageUrl = URL.createObjectURL(file);
        setBackPreviewImage(imageUrl);
      }
      setError(undefined);
    } else {
      if (side === "front") {
        setFrontAttachedImage(null);
        setFrontPreviewImage(null);
      } else {
        setBackAttachedImage(null);
        setBackPreviewImage(null);
      }
    }
  };

  const handleGenerateClick = (side: "front" | "back") => {
    const currentPrompt = side === "front" ? frontPrompt : backPrompt;
    const currentAttachedImage = side === "front" ? frontAttachedImage : backAttachedImage;
    const validation = imageSchema.safeParse(currentAttachedImage);
    if (currentPrompt.trim().length > 0 || (validation.success && currentAttachedImage)) {
      setError(undefined);
    } else {
      setError({
        message: "Please provide a prompt or upload an image to generate.",
      });
    }
  };

  const handleContinue = () => {
    const existingData = localStorage.getItem("standard-builder-data");
    const builderData = existingData ? JSON.parse(existingData) : {};

    const artworkData = {
      ...builderData,
      "standard-builder": {
        ...builderData["standard-builder"],
        artwork: {
          front: {
            prompt: frontPrompt.trim(),
            image: frontAttachedImage ? frontAttachedImage.name : (frontUploadedImage ? frontUploadedImage.name : null),
          },
          back: {
            prompt: backPrompt.trim(),
            image: backAttachedImage ? backAttachedImage.name : (backUploadedImage ? backUploadedImage.name : null),
          },
        },
      },
    };

    console.log(JSON.stringify(artworkData, null, 2));
    localStorage.setItem(
      "standard-builder-data",
      JSON.stringify(artworkData)
    );
    router.push("/standard-builder/confirm-packaging");
  };

  const handleGoBack = () => {
    router.push("/standard-builder/text-rings");
  };

  const canContinue = () => {
    return (
      frontPrompt.trim().length > 0 ||
      frontAttachedImage !== null ||
      frontUploadedImage !== null ||
      backPrompt.trim().length > 0 ||
      backAttachedImage !== null ||
      backUploadedImage !== null
    );
  };

  return (
    <div className="min-h-screen flex flex-row items-start justify-center py-6">
      {/* Left Side - Coin Image */}
      <div className="flex justify-between mb-12 relative w-full max-w-2xl mr-8">
        <div className="flex flex-col items-center">
          <Image
            src="/images/home/coin-design.png"
            alt="Coin"
            width={335}
            height={335}
            className="z-10"
          />
          <Image
            src="/images/home/frame.png"
            alt="Coin Base"
            width={494}
            height={143}
            className="mt-[-50px] z-0"
          />
        </div>
      </div>

      {/* Right Side - Artwork */}
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold text-gray-900 mb-6">
          Provide Detail for the Artwork
        </h1>

        <div className="w-full max-w-lg px-6 rounded-lg shadow-md">
          <div className="flex mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("front")}
              className={`
                py-3 px-6 text-sm font-semibold uppercase tracking-wide transition-colors duration-200
                ${
                  activeTab === "front"
                    ? "text-black border-b-2 border-black"
                    : "text-gray-500 hover:text-gray-700"
                }
              `}
            >
              Front
            </button>
            <button
              onClick={() => setActiveTab("back")}
              className={`
                py-3 px-6 text-sm font-semibold uppercase tracking-wide transition-colors duration-200
                ${
                  activeTab === "back"
                    ? "text-black border-b-2 border-black"
                    : "text-gray-500 hover:text-gray-700"
                }
              `}
            >
              Back
            </button>
          </div>
          <div className="relative">
            <div className="text-center max-w-6xl mx-auto">
              <div className="flex flex-col">
                <div className="relative mb-8">
                  <div className="w-full border-2 border-yellow-500 shadow-lg shadow-yellow-400/20 rounded-xl p-4 text-left">
                    {(activeTab === "front" && frontPreviewImage) || (activeTab === "back" && backPreviewImage) ? (
                      <div className="mb-3">
                        <Image
                          src={(activeTab === "front" ? frontPreviewImage : backPreviewImage) || "/placeholder.png"}
                          alt="Attached Preview"
                          width={64}
                          height={64}
                          className="object-cover rounded-md border border-gray-300 shadow"
                        />
                      </div>
                    ) : null}

                    <textarea
                      className="w-full bg-transparent outline-none resize-none text-sm placeholder-gray-400"
                      placeholder="Ask anything…"
                      rows={4}
                      value={activeTab === "front" ? frontPrompt : backPrompt}
                      onChange={(e) =>
                        activeTab === "front"
                          ? setFrontPrompt(e.target.value)
                          : setBackPrompt(e.target.value)
                      }
                    />
                  </div>

                  {/* Actions */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <button
                      className="mt-5 flex items-center gap-2 bg-gray-200 hover:bg-yellow-400 hover:text-black text-gray-700 px-4 py-2 rounded-full transition-all duration-300 cursor-pointer"
                      onClick={() =>
                        document.getElementById(`image-upload-prompt-${activeTab}`)?.click()
                      }
                    >
                      <Paperclip size={16} />
                    </button>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, activeTab)}
                      className="hidden"
                      id={`image-upload-prompt-${activeTab}`}
                    />

                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleGenerateClick(activeTab)}
                        type="button"
                        variant="primary"
                        className="mt-5 max-w-[90px] w-full text-[10px] font-base items-center justify-center flex mx-auto"
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
          </div>

          <div className="flex justify-center mb-1 items-center">
            <div className="border-t border-gray-400 w-full"></div>
            <div className="px-4 text-sm text-center font-medium text-gray-700 bg-white">
              OR
            </div>
            <div className="border-t border-gray-400 w-full"></div>
          </div>

          <ImageUpload
            onChange={(file) =>
              activeTab === "front" ? setFrontUploadedImage(file) : setBackUploadedImage(file)
            }
            value={activeTab === "front" ? frontUploadedImage : backUploadedImage}
            error={error?.message ? error.message : undefined}
            className=""
            id={`image-upload-artwork-${activeTab}`}
          />

          <p className="text-gray-600 mb-6 mt-4">
            Our 3D Builder may have limitations that our design team can address
            after submission. All designs can be submitted to design team for
            rework/revisions.
          </p>
        </div>

        <div className="flex gap-4 mt-8 justify-between">
          <Button
            variant="ternary"
            onClick={handleGoBack}
            className="max-w-[120px] text-md font-medium border-none !bg-gray-200 text-gray-900 hover:bg-gray-50"
          >
            Go Back
          </Button>
          <Button
            variant="primary"
            onClick={handleContinue}
            className="w-full max-w-[120px] text-md font-medium shadow-md hover:shadow-lg transition-shadow"
            disabled={!canContinue()}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArtWork;