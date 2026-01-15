"use client";
import React, { useEffect, useState } from "react";
import {
  usePaymentPreferences,
  useUpdatePreferredPaymentMethod,
} from "@/src/hooks/useQueries";
import type {
  PaymentMethod,
  SavedPaymentMethod,
} from "@/src/types/paymentPreferences";
import { toast } from "react-toastify";

interface PaymentMethodSelectionProps {
  onMethodSelected?: (method: PaymentMethod) => void;
  showSavedMethods?: boolean;
  allowGuest?: boolean;
}

const PaymentMethodSelection: React.FC<PaymentMethodSelectionProps> = ({
  onMethodSelected,
  showSavedMethods = true,
  allowGuest = false,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null,
  );
  const [selectedSavedMethod, setSelectedSavedMethod] = useState<string | null>(
    null,
  );

  // Check if user is logged in
  const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  };

  const isLoggedIn = !!getCookie("token");

  const {
    data: preferencesData,
    isLoading,
    error,
  } = usePaymentPreferences({
    enabled: isLoggedIn && !allowGuest,
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

  useEffect(() => {
    if (preferencesData?.data?.preferredPaymentMethod) {
      const preferred = preferencesData.data.preferredPaymentMethod;
      setSelectedMethod(preferred);
      if (onMethodSelected) {
        onMethodSelected(preferred);
      }
    }
  }, [preferencesData, onMethodSelected]);

  const handleMethodChange = (method: PaymentMethod) => {
    setSelectedMethod(method);
    if (onMethodSelected) {
      onMethodSelected(method);
    }

    // Only update preference if user is logged in
    if (isLoggedIn && !allowGuest) {
      updatePreferredMethod({ paymentMethod: method });
    }
  };

  const handleSavedMethodSelect = (methodId: string) => {
    setSelectedSavedMethod(methodId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="text-gray-500">Loading payment preferences...</div>
      </div>
    );
  }

  if (error && isLoggedIn && !allowGuest) {
    return (
      <div className="text-red-500 text-sm py-2">
        Failed to load payment preferences. Please try again.
      </div>
    );
  }

  const savedMethods = preferencesData?.data?.savedPaymentMethods || [];

  return (
    <div className="payment-method-selection space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Select Payment Method
      </h3>

      <div className="space-y-3">
        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
          <input
            type="radio"
            name="paymentMethod"
            value="STRIPE"
            checked={selectedMethod === "STRIPE"}
            onChange={() => handleMethodChange("STRIPE")}
            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
            disabled={isUpdating}
          />
          <div className="flex-1">
            <span className="font-medium text-gray-900">
              Credit/Debit Card (Stripe)
            </span>
            <p className="text-sm text-gray-500">Pay securely with your card</p>
          </div>
        </label>

        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
          <input
            type="radio"
            name="paymentMethod"
            value="MANUAL"
            checked={selectedMethod === "MANUAL"}
            onChange={() => handleMethodChange("MANUAL")}
            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
            disabled={isUpdating}
          />
          <div className="flex-1">
            <span className="font-medium text-gray-900">Manual Payment</span>
            <p className="text-sm text-gray-500">
              Upload payment proof for verification
            </p>
          </div>
        </label>
      </div>

      {selectedMethod === "STRIPE" &&
        showSavedMethods &&
        isLoggedIn &&
        !allowGuest &&
        savedMethods.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Saved Payment Methods
            </h4>
            <div className="space-y-2">
              {savedMethods.map((method: SavedPaymentMethod) => (
                <label
                  key={method.id}
                  className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
                >
                  <input
                    type="radio"
                    name="savedMethod"
                    value={method.id}
                    checked={selectedSavedMethod === method.id}
                    onChange={() => handleSavedMethodSelect(method.id)}
                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm text-gray-900">
                      {method.brand?.toUpperCase() || "Card"} ••••{" "}
                      {method.last4}
                      {method.isDefault && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                          Default
                        </span>
                      )}
                    </span>
                  </div>
                </label>
              ))}
            </div>
            {selectedSavedMethod && (
              <p className="mt-2 text-xs text-gray-500">
                Selected saved method will be used for payment
              </p>
            )}
          </div>
        )}

      {selectedMethod === "STRIPE" &&
        showSavedMethods &&
        isLoggedIn &&
        !allowGuest &&
        savedMethods.length === 0 && (
          <p className="mt-2 text-sm text-gray-500">
            No saved payment methods. You can save your card after checkout.
          </p>
        )}
    </div>
  );
};

export default PaymentMethodSelection;
