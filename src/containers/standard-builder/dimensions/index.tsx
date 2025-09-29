"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Input from "@/src/components/common/input";
import Button from "@/src/components/common/button/Button";
import { coinDiameters, coinThicknesses } from "./data";
import { useStandardBuilderStore } from "@/src/store/useStandardBuilderStore";

const Dimensions = () => {
  const router = useRouter();
  const { dimensions, setDimensions } = useStandardBuilderStore();

  const handleContinue = () => {
    if (dimensions.coinDiameter && dimensions.coinThickness) {
      router.push("/standard-builder/material");
    }
  };

  return (
    <div className="min-h-screen flex flex-row items-start justify-center py-10 ">
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
            <Input
              select
              options={coinDiameters}
              placeholder="Select Coin Diameter"
              inputSize="md"
              className="border-none py-3 px-6 rounded-xl"
              bg="bg-gray-100"
              value={dimensions.coinDiameter}
              onChange={(e) =>
                setDimensions({ coinDiameter: e.target.value, coinThickness: dimensions.coinThickness })
              }
            />
          </div>

          <div className="mt-6">
            <h3 className="text-md font-bold text-gray-800 mb-4">
              Coin Thickness
            </h3>
            <Input
              select
              options={coinThicknesses}
              placeholder="Select Coin Thickness"
              inputSize="md"
              className="border-none py-3 px-6 rounded-xl"
              bg="bg-gray-100"
              value={dimensions.coinThickness}
              onChange={(e) =>
                setDimensions({ coinDiameter: dimensions.coinDiameter, coinThickness: e.target.value })
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

