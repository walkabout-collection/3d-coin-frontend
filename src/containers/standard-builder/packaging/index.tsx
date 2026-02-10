"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Input from "@/src/components/common/input";
import Button from "@/src/components/common/button/Button";
import { useStandardBuilderStore } from "@/src/store/useStandardBuilderStore";
import Coin3DViewer from "@/src/components/common/Coin3DViewer";

const Packaging = () => {
  const router = useRouter();
  const {
    packaging,
    setPackaging,
    material,
    dimensions,
    edgeType,
    textRings,
    artwork,
  } = useStandardBuilderStore();

  const handleContinue = () => {
    console.log("Packaging Data:", packaging);
    router.push("/design-summary");
  };

  return (
    <div className="min-h-screen flex flex-row items-start justify-center py-6">
      {/* Left Side - 3D Coin Viewer */}
      <div className="flex justify-between w-full max-w-2xl mr-8 py-12">
        <div className="flex items-center w-full">
          <div className="w-full h-[500px] relative bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg shadow-lg p-4">
            <Coin3DViewer
              materialId={material || "gold"}
              dimensions={dimensions}
              edgeType={edgeType}
              textRings={textRings}
              artwork={artwork}
              className="w-full h-full"
              autoRotate={true}
              enableControls={true}
            />
          </div>
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
              value={packaging.preferences}
              onChange={(e) =>
                setPackaging({ ...packaging, preferences: e.target.value })
              }
            />
          </div>
          <p className="text-gray-600 mb-6 mt-4 text-lg font-medium">
            <span className="font-semibold text-black">Note:</span> Write
            packaging insert design description - Design team will provide
            proof.
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
              value={packaging.backText}
              onChange={(e) =>
                setPackaging({ ...packaging, backText: e.target.value })
              }
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
          disabled={!packaging.preferences.trim() || !packaging.backText.trim()}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default Packaging;
