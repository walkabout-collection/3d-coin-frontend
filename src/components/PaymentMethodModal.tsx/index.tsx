"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { PaymentOption } from "@/src/containers/payment-method/types";
import { paymentOptions } from "./data";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSelect: (option: PaymentOption, amount: number, email?: string) => void;
}

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentSelect,
}) => {
  const [selected, setSelected] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = getCookie("token");
      setIsLoggedIn(!!token);
    };

    checkAuth();
    window.addEventListener("authChanged", checkAuth);
    return () => {
      window.removeEventListener("authChanged", checkAuth);
    };
  }, []);

  const handleSelect = (option: PaymentOption) => {
    setSelected(option.id);
  };

  const handleContinue = () => {
    const selectedOption = paymentOptions.find((opt) => opt.id === selected);
    if (selectedOption && amount) {
      // If logged in, pass undefined for email; otherwise, pass the email input
      const userEmail = isLoggedIn ? undefined : email;
      if (!isLoggedIn && !userEmail) {
        // If not logged in and no email provided, prevent submission
        return;
      }
      onPaymentSelect(selectedOption, parseFloat(amount), userEmail);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 w-[420px] h-[450px] shadow-lg relative flex flex-col">
        {/* Close Button */}
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

        {/* Payment Options */}
        <div className="grid grid-cols-3 gap-4 mt-4">
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

        {/* Amount Input */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Enter Total Coin Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-800"
            placeholder="Enter amount"
          />
        </div>

        {/* Email Input (only shown if not logged in) */}
        {!isLoggedIn && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-800"
              placeholder="Enter your email"
            />
          </div>
        )}

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!selected || !amount || (!isLoggedIn && !email)}
          className={`mt-3 mx-auto py-2 rounded-full font-medium max-w-[180px] px-6 transition ${
            selected && amount && (isLoggedIn || email)
              ? "bg-gradient-to-r from-[#121C2A] via-[#193359] to-[#244978] text-white shadow-[0_4px_12px_rgba(0,0,0,0.6)] hover:from-[#193359] hover:via-[#244978] hover:to-[#2d5b94] cursor-pointer"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;