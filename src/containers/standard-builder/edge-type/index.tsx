"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/src/components/common/button/Button";
import { edgeTypeOptions } from "./data";

const EdgeType = () => {
  const [selectedEdgeType, setSelectedEdgeType] = useState("");
  const router = useRouter();

  const handleEdgeTypeSelect = (edgeTypeId: string) => {
    setSelectedEdgeType(edgeTypeId);
  };

  const handleContinue = () => {
    if (selectedEdgeType) {
      const existingData = localStorage.getItem("standard-builder-data");
      const builderData = existingData ? JSON.parse(existingData) : {};

      const edgeTypeData = {
        ...builderData,
        "standard-builder": {
          ...builderData["standard-builder"],
          "edge-type": selectedEdgeType,
        },
      };

      console.log(JSON.stringify(edgeTypeData, null, 2));
      localStorage.setItem(
        "standard-builder-data",
        JSON.stringify(edgeTypeData)
      );
      router.push("/standard-builder/text-rings");
    }
  };

  const handleGoBack = () => {
    router.push("/standard-builder/material");
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

      {/* Right Side - Edge Type Selection */}
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Select Edge Type        </h1>

        <div className="w-full max-w-md p-6 rounded-lg shadow-md">
          <h3 className="text-md font-bold text-gray-800 mb-4 uppercase tracking-wide">
            Edge Type
          </h3>

          <div className="grid grid-cols-3 gap-6 ">
            {edgeTypeOptions.map((edgeType) => (
              <div key={edgeType.id} className="flex flex-col items-center">
                <div
                  onClick={() => handleEdgeTypeSelect(edgeType.id)}
                  className={`
                    relative cursor-pointer rounded-lg w-[90px] h-[70px] flex items-center justify-center border transition-all duration-300
                    ${
                      selectedEdgeType === edgeType.id
                        ? "border-blue-900 bg-blue-50 shadow-lg"
                        : "border-gray-400 hover:border-gray-300 hover:shadow-md"
                    }
                  `}
                >
                  <Image
                    src={edgeType.image}
                    alt={edgeType.name}
                    width={78}
                    height={78}
                    className="object-contain"
                  />
                </div>

                <span className="mt-2 text-xs font-semibold text-black text-center uppercase tracking-wide">
                  {edgeType.name}
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
            disabled={!selectedEdgeType}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EdgeType;