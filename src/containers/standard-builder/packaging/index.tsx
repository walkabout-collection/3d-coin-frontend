"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Input from "@/src/components/common/input";
import Button from "@/src/components/common/button/Button";

const Packaging = () => {
  const [packagingPreferences, setPackagingPreferences] = useState("");
  const [backText, setBackText] = useState("");
  const router = useRouter();

  const handleContinue = () => {
    const existingData = localStorage.getItem("standard-builder-data");
    const builderData = existingData ? JSON.parse(existingData) : {};

    const packagingData = {
      ...builderData,
      "standard-builder": {
        ...builderData["standard-builder"],
        packaging: {
          preferences: packagingPreferences.trim(),
          backText: backText.trim(),
        },
      },
    };

    console.log(JSON.stringify(packagingData, null, 2));
    localStorage.setItem("standard-builder-data", JSON.stringify(packagingData));
    router.push("/design-summary");
  };

  return (
    <div className="min-h-screen flex flex-row items-start justify-center py-6">
      {/* Left Side - Coin Image */}
      <div className="flex justify-between  w-full max-w-2xl mr-8 py-12">
        <div className="flex items-center mt-10">
          <Image
            src="/images/standard/packaging.png"
            alt="Packaging Image"
            width={494}
            height={143}
            className="mt-[-50px] z-0"
          />
        </div>
      </div>

      {/* Right Side - Form Container */}
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold text-gray-900 mb-6">
          Provide Your Packaging Preferences
        </h1>
        <div className="w-full max-w-lg px-6 rounded-lg shadow-md">
          <div>
            <h3 className="text-md font-bold text-gray-800 mb-4">
              INSERT PACKAGING PREFERENCES
            </h3>
            <Input
              textarea
              rows={3}
              placeholder="Type Your Text Here..."
              inputSize="md"
              className="border-none py-3 px-6 rounded-xl"
              bg="bg-gray-100"
              value={packagingPreferences}
              onChange={(e) => setPackagingPreferences(e.target.value)}
            />
          </div>
          <p className="text-gray-600 mb-6 mt-4 text-lg font-medium">
           <span className="font-semibold text-black">Note:</span>  Write packaging insert design description - Design team will provide proof.
          </p>

          <div className="mt-6">
            <h3 className="text-md font-bold text-gray-800 mb-4">
              INSERT BACK TEXT
            </h3>
            <Input
              textarea
              rows={3}
              placeholder="Type Your Text Here..."
              inputSize="md"
              className="border-none py-3 px-6 rounded-xl"
              bg="bg-gray-100"
              value={backText}
              onChange={(e) => setBackText(e.target.value)}
            />
          </div>

          <p className="text-gray-600 mb-6 mt-4 font-medium text-lg">
            Our 3D Builder may have limitations that our design team can address
            after submission. All designs can be submitted to design team for
            rework/revisions.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleContinue}
          className="mt-8 w-full max-w-[180px] text-lg font-medium shadow-md hover:shadow-lg transition-shadow mx-auto"
          disabled={!packagingPreferences.trim() || !backText.trim()}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default Packaging;