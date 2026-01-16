"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { PaymentOption } from "@/src/containers/payment-method/types";
import { paymentOptions } from "./data";
import { usePaymentPreferences } from "@/src/hooks/useQueries";
import { X } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSelect: (
    option: PaymentOption,
    amount: number,
    email?: string,
  ) => void;
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

  // Fetch payment preferences when logged in
  const { data: preferencesData } = usePaymentPreferences({
    enabled: isLoggedIn && isOpen,
  });

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

  // Pre-select preferred payment method when modal opens and preferences are loaded
  useEffect(() => {
    if (isOpen && isLoggedIn && preferencesData?.data?.preferredPaymentMethod) {
      const preferred = preferencesData.data.preferredPaymentMethod;
      // Find matching option - payment options use uppercase IDs (STRIPE, MANUAL)
      // Note: QuickBooks is no longer available for users
      const matchingOption = paymentOptions.find((opt) => opt.id === preferred);
      if (matchingOption) {
        setSelected(matchingOption.id);
      }
    } else if (isOpen && !isLoggedIn) {
      // Reset selection if user is not logged in
      setSelected("");
    }
  }, [isOpen, isLoggedIn, preferencesData]);

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
      // Reset state when closing
      setSelected("");
      setAmount("");
      setEmail("");
      onClose();
    }
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelected("");
      setAmount("");
      setEmail("");
    }
  }, [isOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative flex flex-col transform transition-all animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Choose Payment Method
            </h2>
            <p className="text-sm text-gray-700 mt-1">
              Select one option to continue
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 flex-1 flex flex-col">
          {/* Payment Options */}
          <div className="grid grid-cols-2 items-center justify-center gap-4">
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
                    style={{ width: "auto", height: "auto" }}
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Enter Quantity of Coins
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a3a] focus:border-transparent transition-all"
              placeholder="e.g. 10"
            />
          </div>

          {/* Email Input (only shown if not logged in) */}
          {!isLoggedIn && (
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Enter Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a3a] focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-auto pt-6 border-t border-gray-200">
            <button
              onClick={handleContinue}
              disabled={!selected || !amount || (!isLoggedIn && !email)}
              className={`w-full py-3 rounded-lg font-semibold transition-all shadow-md ${
                selected && amount && (isLoggedIn || email)
                  ? "bg-gradient-to-r from-[#121C2A] via-[#193359] to-[#244978] text-white hover:from-[#193359] hover:via-[#244978] hover:to-[#2d5b94] hover:shadow-lg cursor-pointer"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
