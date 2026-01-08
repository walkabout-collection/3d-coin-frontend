"use client";
import React, { useState, useEffect } from "react";
import {
  useSavePaymentMethod,
  usePaymentMethodFromSession,
} from "@/src/hooks/useQueries";
import { toast } from "react-toastify";
import Button from "../common/button/Button";

interface SaveCardAfterCheckoutProps {
  sessionId: string;
  onSaved?: () => void;
  onSkip?: () => void;
}

const SaveCardAfterCheckout: React.FC<SaveCardAfterCheckoutProps> = ({
  sessionId,
  onSaved,
  onSkip,
}) => {
  const [saveCard, setSaveCard] = useState(false);
  const [setAsDefault, setSetAsDefault] = useState(false);

  // Get payment method from session
  const {
    data: sessionData,
    isLoading: isLoadingSession,
    error: sessionError,
  } = usePaymentMethodFromSession(sessionId);

  const { mutate: savePaymentMethod, isPending: isSaving } =
    useSavePaymentMethod({
      onSuccess: () => {
        toast.success("Card saved successfully!");
        if (onSaved) {
          onSaved();
        }
      },
      onError: (error) => {
        const msg = error instanceof Error ? error.message : String(error);
        toast.error(msg || "Failed to save card. Please try again.");
      },
    });

  const handleSaveCard = async () => {
    if (!saveCard) {
      if (onSkip) {
        onSkip();
      }
      return;
    }

    if (!sessionData?.data?.paymentMethodId) {
      toast.error("Failed to retrieve payment method. Please try again.");
      return;
    }

    savePaymentMethod({
      paymentMethodId: sessionData.data.paymentMethodId,
      setAsDefault: setAsDefault,
    });
  };

  if (isLoadingSession) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="text-gray-500">Loading payment information...</div>
      </div>
    );
  }

  if (sessionError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 text-sm">
          Failed to retrieve payment information. You can still continue without
          saving your card.
        </p>
        {onSkip && (
          <Button
            variant="primary"
            onClick={onSkip}
            className="mt-3 rounded-full py-2 px-4 text-sm"
          >
            Continue
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="save-card-prompt bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Payment Successful!
      </h3>
      <p className="text-gray-600 text-sm mb-4">
        Your payment has been processed successfully. Would you like to save
        this card for future payments?
      </p>

      <div className="space-y-3 mb-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={saveCard}
            onChange={(e) => setSaveCard(e.target.checked)}
            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
          />
          <span className="text-sm text-gray-700">
            Save this card for future payments
          </span>
        </label>

        {saveCard && (
          <label className="flex items-center cursor-pointer ml-7">
            <input
              type="checkbox"
              checked={setAsDefault}
              onChange={(e) => setSetAsDefault(e.target.checked)}
              className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
            />
            <span className="text-sm text-gray-700">
              Set as default payment method
            </span>
          </label>
        )}
      </div>

      <div className="flex gap-3">
        <Button
          variant="primary"
          onClick={handleSaveCard}
          disabled={isSaving}
          className="flex-1 rounded-full py-2 text-sm"
        >
          {isSaving ? "Saving..." : saveCard ? "Save & Continue" : "Continue"}
        </Button>
        {onSkip && (
          <Button
            variant="ternary"
            onClick={onSkip}
            className="rounded-full py-2 px-4 text-sm !bg-gray-200"
          >
            Skip
          </Button>
        )}
      </div>
    </div>
  );
};

export default SaveCardAfterCheckout;
