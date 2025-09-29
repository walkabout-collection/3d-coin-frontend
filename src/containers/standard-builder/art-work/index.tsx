"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/src/components/common/button/Button";
import { Paperclip } from "lucide-react";
import { z } from "zod";
import ImageUpload from "@/src/components/common/imageUpload";
import { useStandardBuilderStore } from "@/src/store/useStandardBuilderStore";

const ArtWork = () => {
  const router = useRouter();
  const { artwork, updateArtworkSide } = useStandardBuilderStore();
  const [activeTab, setActiveTab] = useState<"front" | "back">("front");
  const [error, setError] = useState<{ message: string } | undefined>(undefined);

  const { front, back } = artwork;
  const imageSchema = z.instanceof(File, { message: "Please upload an image" });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: "front" | "back") => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      updateArtworkSide(side, { attachedImage: file, previewImage: imageUrl });
      setError(undefined);
    } else {
      updateArtworkSide(side, { attachedImage: null, previewImage: null });
    }
  };

  const handleGenerateClick = (side: "front" | "back") => {
    const current = artwork[side];
    const validation = imageSchema.safeParse(current.attachedImage);

    if (current.prompt.trim().length > 0 || (validation.success && current.attachedImage)) {
      setError(undefined);
    } else {
      setError({ message: "Please provide a prompt or upload an image to generate." });
    }
  };

  const handleContinue = () => {
    console.log("Artwork Saved:", artwork);
    router.push("/standard-builder/confirm-packaging");
  };

  const handleGoBack = () => {
    router.push("/standard-builder/text-rings");
  };

  const canContinue = () => {
    return (
      front.prompt.trim().length > 0 ||
      front.attachedImage !== null ||
      front.uploadedImage !== null ||
      back.prompt.trim().length > 0 ||
      back.attachedImage !== null ||
      back.uploadedImage !== null
    );
  };

  return (
    <div className="min-h-screen flex flex-row items-start justify-center py-6">
      {/* Left Side - Coin Image */}
      <div className="flex justify-between mb-12 relative w-full max-w-2xl mr-8">
        <div className="flex flex-col items-center">
          <Image src="/images/home/coin-design.png" alt="Coin" width={335} height={335} className="z-10" />
          <Image src="/images/home/frame.png" alt="Coin Base" width={494} height={143} className="mt-[-50px] z-0" />
        </div>
      </div>

      {/* Right Side - Artwork */}
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold text-gray-900 mb-6">
          Provide Detail for the Artwork
        </h1>

        <div className="w-full max-w-lg px-6 rounded-lg shadow-md">
          {/* Tabs */}
          <div className="flex mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("front")}
              className={`py-3 px-6 text-sm font-semibold uppercase ${
                activeTab === "front" ? "text-black border-b-2 border-black" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Front
            </button>
            <button
              onClick={() => setActiveTab("back")}
              className={`py-3 px-6 text-sm font-semibold uppercase ${
                activeTab === "back" ? "text-black border-b-2 border-black" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Back
            </button>
          </div>

          {/* Prompt + Image Upload */}
          <div className="relative">
            <div className="text-center max-w-6xl mx-auto">
              <div className="flex flex-col">
                <div className="relative mb-8">
                  <div className="w-full border-2 border-yellow-500 rounded-xl p-4 text-left">
                    {((activeTab === "front" && front.previewImage) ||
                      (activeTab === "back" && back.previewImage)) && (
                      <div className="mb-3">
                        <Image
                          src={(activeTab === "front" ? front.previewImage : back.previewImage) || "/placeholder.png"}
                          alt="Attached Preview"
                          width={64}
                          height={64}
                          className="object-cover rounded-md border border-gray-300 shadow"
                        />
                      </div>
                    )}

                    <textarea
                      className="w-full bg-transparent outline-none resize-none text-sm placeholder-gray-400"
                      placeholder="Ask anything…"
                      rows={4}
                      value={activeTab === "front" ? front.prompt : back.prompt}
                      onChange={(e) =>
                        updateArtworkSide(activeTab, { prompt: e.target.value })
                      }
                    />
                  </div>

                  {/* Actions */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <button
                      className="mt-5 flex items-center gap-2 bg-gray-200 hover:bg-yellow-400 px-4 py-2 rounded-full"
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
                        className="mt-5 max-w-[90px] w-full text-[10px]"
                      >
                        GENERATE
                      </Button>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mt-1 text-red-500 text-sm">
                    <span>{error.message}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* OR Upload */}
          <div className="flex justify-center mb-1 items-center">
            <div className="border-t border-gray-400 w-full"></div>
            <div className="px-4 text-sm text-gray-700 bg-white">OR</div>
            <div className="border-t border-gray-400 w-full"></div>
          </div>

          <ImageUpload
            onChange={(file) => updateArtworkSide(activeTab, { uploadedImage: file })}
            value={activeTab === "front" ? front.uploadedImage : back.uploadedImage}
            error={error?.message}
            id={`image-upload-artwork-${activeTab}`}
          />

          <p className="text-gray-600 mb-6 mt-4">
            Our 3D Builder may have limitations that our design team can address after submission.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-8 justify-between">
          <Button variant="ternary" onClick={handleGoBack}>
            Go Back
          </Button>
          <Button variant="primary" onClick={handleContinue} disabled={!canContinue()}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArtWork;
