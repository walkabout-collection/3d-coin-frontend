"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/src/components/common/button/Button";
import { edgeTypeOptions } from "./data";
import { useStandardBuilderStore } from "@/src/store/useStandardBuilderStore";
import Coin3DViewer from "@/src/components/common/Coin3DViewer";

const EdgeType = () => {
  const router = useRouter();
  const { edgeType, setEdgeType, material, dimensions, textRings, artwork } =
    useStandardBuilderStore();

  // Set default edge type to "smooth" if none is selected
  useEffect(() => {
    if (!edgeType || edgeType.trim() === "") {
      setEdgeType("smooth");
    }
  }, [edgeType, setEdgeType]);

  const handleEdgeTypeSelect = (edgeTypeId: string) => {
    console.log("🔄 Edge Type Selected:", edgeTypeId);
    setEdgeType(edgeTypeId);
  };

  const handleContinue = () => {
    if (edgeType) {
      router.push("/standard-builder/text-rings");
    }
  };

  const handleGoBack = () => {
    router.push("/standard-builder/material");
  };

  return (
    <div className="min-h-screen flex flex-row items-start justify-center py-6">
      {/* Left Side - 3D Coin Viewer */}
      <div className="flex justify-between mb-12 relative w-full max-w-2xl mr-8">
        <div className="flex flex-col items-center w-full">
          <div className="w-full h-[500px] relative  p-4">
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

      {/* Right Side - Edge Type Selection */}
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Select Edge Type
        </h1>

        <div className="w-full max-w-md p-6 rounded-lg shadow-md">
          <h3 className="text-md font-bold text-gray-800 mb-4 uppercase tracking-wide">
            Edge Type
          </h3>

          <div className="grid grid-cols-3 gap-6 ">
            {edgeTypeOptions.map((et) => (
              <div key={et.id} className="flex flex-col items-center">
                <div
                  onClick={() => handleEdgeTypeSelect(et.id)}
                  className={`
                    relative cursor-pointer rounded-lg w-[90px] h-[70px] flex items-center justify-center border transition-all duration-300
                    ${
                      edgeType === et.id
                        ? "border-blue-900 bg-blue-50 shadow-lg"
                        : "border-gray-400 hover:border-gray-300 hover:shadow-md"
                    }
                  `}
                >
                  <Image
                    src={et.image}
                    alt={et.name}
                    width={78}
                    height={78}
                    className="object-contain"
                  />
                </div>

                <span className="mt-2 text-xs font-semibold text-black text-center uppercase tracking-wide">
                  {et.name}
                </span>
              </div>
            ))}
          </div>

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
            className="max-w-[140px] text-lg font-medium border-none !bg-gray-200 text-gray-900 hover:bg-gray-50"
          >
            Go Back
          </Button>
          <Button
            variant="primary"
            onClick={handleContinue}
            className="w-full max-w-[140px] text-lg font-medium shadow-md hover:shadow-lg transition-shadow"
            disabled={!edgeType}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EdgeType;
