"use client";
import React, { useState } from "react";
import Image from "next/image";
import Button from "../common/button/Button";
import PaymentModal from "../PaymentMethodModal.tsx";
import Input from "../common/input";
import { buttonTexts } from "./data";
import { ThreeDRenderProps } from "./types";
import { useDesignCoinStore, useQAPromptsStore } from "@/src/store/useCoinStore";
import { useCreateDesign } from "@/src/hooks/useQueries";
import { toast } from "react-toastify";
import { PaymentOption } from "@/src/containers/payment-method/types";
import { useRouter } from "next/navigation";

export const ThreeDRender: React.FC<ThreeDRenderProps> = ({
  name = "AI Generated 3D Render",
  onSaveAsDraft,
  onContinue,
  loading = false,
}) => {
  const router = useRouter();
  const { frontImages, backImages } = useDesignCoinStore();
  const { formData, isInProgress } = useQAPromptsStore();
  const frontImage = frontImages.at(-1) || "/images/home/front-side.png";
  const backImage = backImages.at(-1) || "/images/home/front-side.png";

  const [isProcessing, setIsProcessing] = useState(false);
  const [frontImageLoaded, setFrontImageLoaded] = useState(false);
  const [backImageLoaded, setBackImageLoaded] = useState(false);
  const [frontImageError, setFrontImageError] = useState(false);
  const [backImageError, setBackImageError] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentOption | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>("");

  const { mutate: createDesign, isPending } = useCreateDesign({
    onSuccess: () => {
      toast.success("Design submitted successfully!");
      setShowPaymentModal(false);
      setSelectedPayment(null);
      setAmount(null);
      setFeedback("");
      router.push("/success");
    },
    onError: (err) => {
      toast.error("Failed to submit design: " + err.message);
    },
  });

  const handleSaveAsDraft = async () => {
    if (onSaveAsDraft) {
      setIsProcessing(true);
      try {
        await onSaveAsDraft();
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleSubmitForQuote = (paymentOption?: PaymentOption, amountValue?: number) => {
    const payment = paymentOption || selectedPayment;
    const qty = amountValue !== undefined ? amountValue : amount;

    if (!payment || qty === null) {
      setShowPaymentModal(true);
      return;
    }

    const designData = {
      name: name,
      status: "SUBMITTED" as const,
      totalCoins: qty,
      email: "user@example.com",
      method: payment.name.toUpperCase() as "STRIPE" | "QUICKBOOKS" | "MANUAL",
      frontImage: frontImage,
      frontDescription: formData.frontDescription || undefined,
      frontText: formData.frontTextInsideArtwork || undefined,
      backImage: backImage,
      backDescription: formData.backDescription || undefined,
      backText: formData.backTextInsideArtwork || undefined,
      coinShape: formData.coinShape || undefined,
      materialFinish: formData.metalFinishes || undefined,
      frontReferenceImage: formData.frontReferenceImage || undefined,
      backReferenceImage: formData.backReferenceImage || undefined,
      frontReferenceImageImpact: formData.frontReferenceImageImpact || undefined,
      backReferenceImageImpact: formData.backReferenceImageImpact || undefined,
      frontTextStyle: formData.frontTextStyle || undefined,
      backTextStyle: formData.backTextStyle || undefined,
      frontCompositionNotes: formData.frontCompositionNotes || undefined,
      backCompositionNotes: formData.backCompositionNotes || undefined,
      prohibitedContent: formData.prohibitedContent || undefined,
      subject: formData.subject || undefined,
      coinStyles: formData.coinStyles || undefined,
      detailLevel: formData.detailLevel || undefined,
    };

    createDesign(designData);

    if (onContinue) {
      setIsProcessing(true);
      try {
        onContinue();
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handlePaymentSelect = (option: PaymentOption, amount: number) => {
    setSelectedPayment(option);
    setAmount(amount);
    handleSubmitForQuote(option, amount);
  };

  const handleModalClose = () => {
    setShowPaymentModal(false);
  };

  return (
    <>
      <div className="max-w-5xl mx-auto p-8 bg-white min-h-screen py-16">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 tracking-wide">{name}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
          {/* Front */}
          <div className="flex flex-col w-full items-center">
            <h3 className="text-md text-start font-semibold text-gray-800 tracking-wide uppercase">
              Front Design
            </h3>
            <div className="relative flex items-center justify-center w-full max-w-[500px] h-[400px]">
              {!frontImageLoaded && !frontImageError && (
                <div className="animate-pulse text-gray-400">Loading...</div>
              )}
              <Image
                src={frontImageError ? "/images/home/front-side.png" : frontImage}
                alt="Front coin render"
                fill
                className={`object-contain transition-all duration-500 ${
                  frontImageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
                onLoadingComplete={() => setFrontImageLoaded(true)}
                onError={() => {
                  setFrontImageError(true);
                  setFrontImageLoaded(false);
                }}
              />
            </div>
          </div>

          {/* Back */}
          <div className="flex flex-col w-full items-center">
            <h3 className="text-md font-semibold text-gray-800 tracking-wide uppercase">
              Back Design
            </h3>
            <div className="relative flex items-center justify-center w-full max-w-[500px] h-[400px]">
              {!backImageLoaded && !backImageError && (
                <div className="animate-pulse text-gray-400">Loading...</div>
              )}
              <Image
                src={backImageError ? "/images/home/front-side.png" : backImage}
                alt="Back coin render"
                fill
                className={`object-contain transition-all duration-500 ${
                  backImageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
                onLoadingComplete={() => setBackImageLoaded(true)}
                onError={() => {
                  setBackImageError(true);
                  setBackImageLoaded(false);
                }}
              />
            </div>
          </div>
        </div>

      
        {/* Buttons */}
        <div className="flex justify-center space-x-6 mt-8">
          <Button
            type="button"
            variant="ternary"
            onClick={handleSaveAsDraft}
            disabled={loading || isProcessing || isPending}
            className="max-w-[180px] w-full text-md font-base !bg-gray-200 border-none min-w-[140px]"
          >
            {isProcessing && !onContinue ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span>{buttonTexts.loading}</span>
              </div>
            ) : (
              buttonTexts.saveAsDraft
            )}
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={() => handleSubmitForQuote()}
            disabled={loading || isProcessing || isPending}
            className="rounded-full font-base text-md max-w-[140px]"
          >
            {isPending ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span>{buttonTexts.loading}</span>
              </div>
            ) : (
              "SUBMIT FOR QUOTE"
            )}
          </Button>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={handleModalClose}
        onPaymentSelect={handlePaymentSelect}
      />
    </>
  );
};

export default ThreeDRender;