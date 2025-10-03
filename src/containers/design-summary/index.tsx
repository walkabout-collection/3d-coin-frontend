"use client";
import React, { useState } from "react";
import Image from "next/image";
import Button from "@/src/components/common/button/Button";
import { bottomButtons } from "@/src/containers/design-summary/data";
import { PaymentOption } from "@/src/containers/payment-method/types";
import PaymentModal from "@/src/components/PaymentMethodModal.tsx";
import Input from "@/src/components/common/input";
import { useStandardBuilderStore } from "@/src/store/useStandardBuilderStore";
import { useRouter } from "next/navigation";

const DesignSummarySection = () => {
  const [selectedButton, setSelectedButton] = useState<number | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentOption | null>(
    null
  );
  const [feedback, setFeedback] = useState<string>("");
  const isLoggedIn = false;

  const router = useRouter();

  const { dimensions, material, edgeType, artwork, packaging } =
    useStandardBuilderStore();

    // console.table({dimensions, material, edgeType, artwork, packaging});

  const handleButtonClick = (id: number) => {
    setSelectedButton(selectedButton === id ? null : id);
  };

  const handleSubmitForQuote = () => {
    if (!selectedPayment) {
      setShowPaymentModal(true);
      return;
    }
    console.log("Submitting quote with payment method:", selectedPayment);
  };

  const handlePaymentSelect = (option: PaymentOption) => {
    setSelectedPayment(option);
  };

  const handleModalClose = () => {
    setShowPaymentModal(false);
  };


  const handleFirstButtonAction = async () => {
    //  dummy API call
    try {
      const response = await fetch("https://dummyapi.example.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          standardBuilderData: JSON.parse(localStorage.getItem("standard-builder-data") || "{}"),
        }),
      });

      if (response.ok) {
        console.log("Dummy API call successful");
      } else {
        throw new Error("Dummy API call failed");
      }
    } catch (error) {
      console.error("Error in dummy API call:", error);
    }
  };
 

  const summaryOptions = [
    {
      id: 1,
      label: "Dimensions",
      value: `Diameter: ${dimensions.coinDiameter}, Thickness: ${dimensions.coinThickness}`,
      type: "size",
      image: "/images/home/dimensions.png",
      path: "/standard-builder",
    },
    {
      id: 2,
      label: "Material",
      value: material,
      type: "material",
      image: "/images/home/dimensions.png",
      path: "/standard-builder/material",

    },
    {
      id: 3,
      label: "Edge Type",
      value: edgeType,
      type: "edge",
      image: "/images/home/dimensions.png",
      path: "/standard-builder/edge-type",

    },
    {
      id: 4,
      label: "Artwork",
      value: `Front: ${artwork.front.prompt || artwork.front.previewImage|| "N/A"}, Back: ${
        artwork.back.prompt || artwork.back.previewImage || "N/A"
      }`,
      type: "artwork",
      image: "/images/home/dimensions.png",
      path: "/standard-builder/artwork",
    },
    {
      id: 5,
      label: "Packaging",
      value: `Preferences: ${packaging.preferences}, Back Text: ${packaging.backText}`,
      type: "packaging",
      image: "/images/home/dimensions.png",
      path: "/standard-builder/packaging",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-14">
      <h2 className="text-3xl max-w-xl mx-auto font-bold text-gray-900 mb-12 text-center">
        Work with our expert team to create your custom design.
      </h2>

      <div className="space-y-4 mb-12">
        {summaryOptions.map((option) => (
          <div
            key={option.id}
            className="flex items-center justify-between bg-gray-100 py-3 px-4 rounded-lg"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg overflow-hidden">
                <Image
                  src={option.image}
                  alt={option.label}
                  width={50}
                  height={50}
                  className="object-contain"
                />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  {option.label}
                </div>
                <div className="text-sm text-gray-800 mt-1">
                  {option.type.toUpperCase()}: {option.value}
                </div>
              </div>
            </div>
            <div
              className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors"
              onClick={() => router.push(option.path)}
            >
              <Image
                src="/images/home/edit-icon.svg"
                alt="Edit Icon"
                width={14}
                height={14}
                className="cursor-pointer"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Coin Preview */}
      <div className="flex justify-center mb-12 relative">
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

      {/* Bottom Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        {bottomButtons.map((btn, index) => (
          <Button
            key={btn.id}
            type="button"
            variant="ternary"
             onClick={() => {
              handleButtonClick(btn.id);
              if (index === 0) {
                handleFirstButtonAction();
              } else if (index === 2) {
                router.push("/design-team");
              }
            }}
            className={`py-6 px-6 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedButton === btn.id
                ? "bg-white border drop-shadow-2xl shadow-yellow-400 border-yellow-400 text-black"
                : "bg-gray-200 text-gray-900 hover:border-gray-400"
            }`}
          >
            {btn.label}
          </Button>
        ))}
      </div>

      {selectedButton === 2 && (
        <div className="mx-auto mb-8">
          <label
            htmlFor="feedback"
            className="block text-md font-semibold text-gray-700 mb-2"
          >
            Feedback for Designer
          </label>
          <Input
            textarea
            rows={3}
            placeholder="Enter your feedback here"
            inputSize="md"
            className="border-none py-3 px-6 rounded-xl"
            bg="bg-gray-100"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        {isLoggedIn && (
          <Button
            type="button"
            variant="ternary"
            className="max-w-[280px] w-full text-md font-base !bg-gray-200 border-none"
          >
            SAVE AS DRAFT
          </Button>
        )}
        <Button
          type="button"
          variant="primary"
          onClick={handleSubmitForQuote}
          className="max-w-[280px] w-full text-lg font-medium"
        >
          SUBMIT FOR QUOTE
        </Button>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={handleModalClose}
        onPaymentSelect={handlePaymentSelect}
      />
    </div>
  );
};

export default DesignSummarySection;
