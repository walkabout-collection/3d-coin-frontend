"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Button from "@/src/components/common/button/Button";
import { XCircle } from "lucide-react";

const PaymentCancelPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <XCircle className="h-16 w-16 text-orange-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Payment Cancelled
        </h1>
        <p className="text-gray-600 mb-6">
          Your payment was cancelled. You can try again when you&apos;re ready
          to complete the payment.
        </p>
        <div className="flex flex-col gap-3">
          <Button
            variant="primary"
            onClick={() => router.push("/dashboard/quotes")}
            className="w-full rounded-full py-3"
          >
            Back to Quotes
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

export default PaymentCancelPage;
