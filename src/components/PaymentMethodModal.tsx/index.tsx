"use client";
import React, { useState } from "react";
import Image from "next/image";
import { PaymentOption } from "@/src/containers/payment-method/types";
import { paymentOptions } from "./data";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSelect: (option: PaymentOption) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentSelect,
}) => {
  const [selected, setSelected] = useState<string>("");

  const handleSelect = (option: PaymentOption) => {
    setSelected(option.id);
    onPaymentSelect(option);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 w-[420px] h-[380px] shadow-lg relative flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          <Image
            src="/images/dashboard/cross-icon.svg"
            alt="Close"
            width={14}
            height={14}
          />
        </button>

        <h2 className="text-xl font-bold mb-2 text-center">
          Choose Payment Method
        </h2>
        <p className="text-gray-500 text-sm mb-6 text-center">
          Select one option to continue
        </p>

        <div className="grid grid-cols-3 gap-4 mt-8">
          {paymentOptions.map((option) => (
            <label
              key={option.id}
              className={`border rounded-lg flex flex-col items-center justify-center gap-2 py-2 px-2 cursor-pointer transition ${
                selected === option.id
                  ? "border-blue-800 ring-1 ring-blue-800"
                  : "border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value={option.id}
                checked={selected === option.id}
                onChange={() => handleSelect(option)}
                className="hidden"
              />
              <div className="w-12 h-12 flex items-center justify-center">
                <Image
                  src={option.logo}
                  alt={option.name}
                  width={40}
                  height={40}
                  className="object-contain max-w-full max-h-full"
                />
              </div>
              <span className="text-xs font-medium text-gray-700 text-center">
                {option.name}
              </span>
            </label>
          ))}
        </div>

        <button
          onClick={onClose}
          disabled={!selected}
          className={`mt-auto mx-auto py-2 rounded-full font-medium max-w-[180px] px-6 transition c${
            selected
              ? "bg-gradient-to-r from-[#121C2A] via-[#193359] to-[#244978] text-white shadow-[0_4px_12px_rgba(0,0,0,0.6)] hover:from-[#193359] hover:via-[#244978] hover:to-[#2d5b94] cursor-pointer"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;
