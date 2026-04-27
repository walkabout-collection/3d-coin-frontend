"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Dropdown from "@/src/components/common/dropdown";
import Button from "@/src/components/common/button/Button";
import { coinDiameters, coinThicknesses } from "./data";
import { useStandardBuilderStore } from "@/src/store/useStandardBuilderStore";
import Coin3DViewer from "@/src/components/common/Coin3DViewer";

const Dimensions = () => {
  const router = useRouter();
  const { dimensions, setDimensions, material, edgeType, textRings, artwork } =
    useStandardBuilderStore();

  const handleContinue = () => {
    if (dimensions.coinDiameter && dimensions.coinThickness) {
      router.push("/standard-builder/material");
    }
  };

  return (
    <div className="min-h-screen flex flex-row items-start justify-center py-10 ">
      <div className="flex justify-between mb-12 relative w-full max-w-2xl mr-8">
        <div className="flex flex-col items-center w-full">
          <div className="w-full h-[500px] relative p-4">
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
        <h1 className="text-xl font-semibold text-gray-900  mb-6">
          Select Your Coin Dimensions
        </h1>
        <div className="w-full max-w-md p-6 te rounded-lg shadow-md">
          <div>
            <h3 className="text-md font-bold text-gray-800 mb-4">
              Coin Diameter
            </h3>
            <Dropdown
              options={coinDiameters}
              placeholder="Select Coin Diameter"
              ariaLabel="Coin Diameter"
              value={dimensions.coinDiameter}
              onChange={(value) =>
                setDimensions({
                  coinDiameter: value,
                  coinThickness: dimensions.coinThickness,
                })
              }
            />
          </div>

          <div className="mt-6">
            <h3 className="text-md font-bold text-gray-800 mb-4">
              Coin Thickness
            </h3>
            <Dropdown
              options={coinThicknesses}
              placeholder="Select Coin Thickness"
              ariaLabel="Coin Thickness"
              value={dimensions.coinThickness}
              onChange={(value) =>
                setDimensions({
                  coinDiameter: dimensions.coinDiameter,
                  coinThickness: value,
                })
              }
            />
          </div>

          <p className="text-gray-600 mb-6 mt-4">
            Our 3D Builder may have limitations that our design team can address
            after submission. All designs can be submitted to design team for
            rework/revisions.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleContinue}
          className="mt-8 w-full max-w-[180px] text-lg font-medium shadow-md hover:shadow-lg transition-shadow mx-auto"
          disabled={!dimensions.coinDiameter || !dimensions.coinThickness}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default Dimensions;
