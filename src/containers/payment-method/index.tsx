"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { paymentOptions } from "./data";
import { PaymentOption } from "./types";
import {
  usePaymentPreferences,
  useUpdatePreferredPaymentMethod,
  useQuickBooksConnectionStatus,
} from "@/src/hooks/useQueries";
import ManagePaymentMethods from "@/src/components/ManagePaymentMethods";
import QuickBooksOAuthModal from "@/src/components/QuickBooks/QuickBooksOAuthModal";
import QuickBooksConnectionStatus from "@/src/components/QuickBooks/QuickBooksConnectionStatus";
import QuickBooksTransactions from "@/src/components/QuickBooks/QuickBooksTransactions";
import { toast } from "react-toastify";
import type { PaymentMethod } from "@/src/types/paymentPreferences";

const PaymentMethodContainer: React.FC = () => {
  const [selected, setSelected] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isQuickBooksModalOpen, setIsQuickBooksModalOpen] = useState(false);

  // Check if user is logged in
  const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  };

  // Check auth status first
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

  const { data: preferencesData, isLoading: isLoadingPreferences } =
    usePaymentPreferences({
      enabled: isLoggedIn,
    });

  // Check QuickBooks connection status when QuickBooks is selected
  const { data: quickBooksStatus } = useQuickBooksConnectionStatus({
    enabled: isLoggedIn && selected === "quickbooks",
  });

  const { mutate: updatePreferredMethod, isPending: isUpdating } =
    useUpdatePreferredPaymentMethod({
      onSuccess: () => {
        toast.success("Payment preference updated successfully");
      },
      onError: (error) => {
        const msg = error instanceof Error ? error.message : String(error);
        toast.error(msg || "Failed to update payment preference");
      },
    });

  // Map payment option IDs to PaymentMethod type
  const mapOptionIdToPaymentMethod = (id: string): PaymentMethod | null => {
    const lowerId = id.toLowerCase();
    if (lowerId === "stripe") return "STRIPE";
    if (lowerId === "manual") return "MANUAL";
    if (lowerId === "quickbooks") return "QUICKBOOKS";
    return null;
  };

  // Set selected based on user preferences - runs when preferences are loaded
  useEffect(() => {
    if (isLoggedIn && preferencesData?.data?.preferredPaymentMethod) {
      const preferred =
        preferencesData.data.preferredPaymentMethod.toLowerCase();
      // Find matching option - payment options use lowercase IDs
      const matchingOption = paymentOptions.find(
        (opt) => opt.id.toLowerCase() === preferred,
      );
      if (matchingOption) {
        setSelected(matchingOption.id);
      }
    } else if (!isLoggedIn) {
      // Reset selection if user logs out
      setSelected("");
    }
  }, [preferencesData, isLoggedIn]);

  const handleSelect = async (option: PaymentOption) => {
    setSelected(option.id);

    // Update preference if user is logged in
    if (isLoggedIn) {
      const paymentMethod = mapOptionIdToPaymentMethod(option.id);
      if (paymentMethod) {
        updatePreferredMethod({ paymentMethod });
      }

      // If QuickBooks is selected and not connected, open OAuth modal
      if (option.id === "quickbooks" && !quickBooksStatus?.data?.connected) {
        setIsQuickBooksModalOpen(true);
      }
    }
  };

  const handleQuickBooksConnectSuccess = () => {
    // Refetch connection status after successful connection
    // The query will automatically refetch when enabled
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2">Payment Method</h2>
      <p className="text-gray-600 mb-6">
        {isLoggedIn
          ? isLoadingPreferences
            ? "Loading your payment preferences..."
            : selected
              ? `Your preferred payment method: ${paymentOptions.find((opt) => opt.id === selected)?.name || ""}`
              : "Choose your preferred payment method below"
          : "Choose Payment Method Below"}
      </p>

      {/* Loading State */}
      {isLoggedIn && isLoadingPreferences && (
        <div className="flex items-center justify-center py-8 mb-8">
          <div className="text-gray-500">
            Loading your payment preferences...
          </div>
        </div>
      )}

      {/* Payment Method Selection with Images */}
      {(!isLoggedIn || !isLoadingPreferences) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {paymentOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => handleSelect(option)}
              className={`relative cursor-pointer rounded-xl h-[232px] w-full max-w-[332px] flex flex-col items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 transition ${
                selected === option.id ? "ring-2 ring-blue-800 bg-blue-50" : ""
              } ${isUpdating ? "opacity-50 cursor-wait" : ""}`}
            >
              <div className="absolute top-3 right-3">
                <span
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selected === option.id
                      ? "border-blue-800 bg-blue-800"
                      : "border-gray-400"
                  }`}
                >
                  {selected === option.id && (
                    <span className="w-3.5 h-3.5 rounded-full bg-white"></span>
                  )}
                </span>
              </div>

              <Image
                src={option.logo}
                alt={option.name}
                width={80}
                height={80}
                className="object-contain"
              />
              <p className="text-sm font-medium text-gray-700">{option.name}</p>
              {selected === option.id && isLoggedIn && (
                <p className="text-xs text-blue-600 font-medium mt-1">
                  ✓ Selected
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* QuickBooks Connection Status and Transactions */}
      {isLoggedIn && selected === "quickbooks" && (
        <div className="mt-8 space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <QuickBooksConnectionStatus
              onReconnect={() => setIsQuickBooksModalOpen(true)}
            />
          </div>

          {quickBooksStatus?.data?.connected && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <QuickBooksTransactions limit={10} />
            </div>
          )}
        </div>
      )}

      {/* Saved Payment Methods (only for logged-in users) */}
      {isLoggedIn && (
        <div className="mt-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <ManagePaymentMethods />
          </div>
        </div>
      )}

      {!isLoggedIn && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
          <p className="text-yellow-800 text-sm">
            Please log in to save your payment preference and manage saved
            payment methods.
          </p>
        </div>
      )}

      {/* QuickBooks OAuth Modal */}
      <QuickBooksOAuthModal
        isOpen={isQuickBooksModalOpen}
        onClose={() => setIsQuickBooksModalOpen(false)}
        onSuccess={handleQuickBooksConnectSuccess}
      />
    </div>
  );
};

export default PaymentMethodContainer;
