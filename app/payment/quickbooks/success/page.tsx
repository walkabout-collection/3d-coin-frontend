"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import Button from "@/src/components/common/button/Button";

export default function QuickBooksSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          QuickBooks Connected Successfully!
        </h1>

        <p className="text-gray-600 mb-6">
          Your QuickBooks account has been connected. You can now create
          invoices and sync payments.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            Redirecting to dashboard in {countdown} second
            {countdown !== 1 ? "s" : ""}...
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="primary"
            onClick={() => router.push("/dashboard")}
            className="flex-1"
          >
            Go to Dashboard
          </Button>
          <Button
            variant="ternary"
            onClick={() => router.push("/dashboard/payment-method")}
            className="flex-1"
          >
            Payment Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
