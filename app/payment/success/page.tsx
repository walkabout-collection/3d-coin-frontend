"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Button from "@/src/components/common/button/Button";
import { CheckCircle } from "lucide-react";
import SaveCardAfterCheckout from "@/src/components/SaveCardAfterCheckout";

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showSaveCard, setShowSaveCard] = useState(true);
  const [cardSaved, setCardSaved] = useState(false);

  // Check if user is logged in
  const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  };

  const isLoggedIn = !!getCookie("token");

  useEffect(() => {
    const session_id = searchParams.get("session_id");
    setSessionId(session_id);
  }, [searchParams]);

  const handleCardSaved = () => {
    setCardSaved(true);
    setShowSaveCard(false);
  };

  const handleSkip = () => {
    setShowSaveCard(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            Your payment has been processed successfully. Your order has been
            created and you will receive a confirmation email shortly.
          </p>
        </div>

        {/* Show save card prompt for logged-in users with Stripe session */}
        {showSaveCard && isLoggedIn && sessionId && (
          <div className="mb-6">
            <SaveCardAfterCheckout
              sessionId={sessionId}
              onSaved={handleCardSaved}
              onSkip={handleSkip}
            />
          </div>
        )}

        {cardSaved && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 text-sm">
              ✓ Your card has been saved successfully!
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Button
            variant="primary"
            onClick={() => router.push("/dashboard/orders")}
            className="w-full rounded-full py-3"
          >
            View Orders
          </Button>
          <Button
            variant="ternary"
            onClick={() => router.push("/dashboard")}
            className="w-full rounded-full py-3 !bg-gray-200"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
