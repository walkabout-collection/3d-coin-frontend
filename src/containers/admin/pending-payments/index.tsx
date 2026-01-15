"use client";
import React, { useState } from "react";
import {
  usePendingManualPayments,
  useApproveUserPayment,
} from "@/src/hooks/useQueries";
import { toast } from "react-toastify";
import Button from "@/src/components/common/button/Button";
import Image from "next/image";
import Search from "@/src/components/common/search";

interface PendingPayment {
  paymentId: string;
  quoteId: string;
  amount: number;
  paymentProof: string;
  createdAt: string;
  customer: string;
  customerEmail: string;
  quote: {
    id: string;
    totalCoins: number;
    status: string;
  };
}

const AdminPendingPayments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<PendingPayment | null>(
    null,
  );
  const [showApproveModal, setShowApproveModal] = useState(false);

  const {
    data: paymentsData,
    isPending,
    isError,
    refetch,
  } = usePendingManualPayments();

  const { mutate: approvePayment, isPending: isApproving } =
    useApproveUserPayment({
      onSuccess: () => {
        toast.success("Payment approved successfully. Order has been created.");
        setShowApproveModal(false);
        setSelectedPayment(null);
        refetch();
      },
      onError: (error) => {
        const msg = error instanceof Error ? error.message : String(error);
        console.error("Error approving payment:", error);
        toast.error(msg || "Failed to approve payment. Please try again.");
      },
    });

  const handleApprove = (payment: PendingPayment) => {
    setSelectedPayment(payment);
    setShowApproveModal(true);
  };

  const handleConfirmApprove = () => {
    if (selectedPayment) {
      approvePayment(selectedPayment.paymentId);
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return "Invalid date";
    }
  };

  const filteredPayments =
    paymentsData?.data?.filter((payment) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        payment.customer.toLowerCase().includes(searchLower) ||
        payment.customerEmail.toLowerCase().includes(searchLower) ||
        payment.quoteId.toLowerCase().includes(searchLower) ||
        payment.paymentId.toLowerCase().includes(searchLower)
      );
    }) || [];

  if (isPending) {
    return (
      <div className="min-h-screen">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Loading pending payments...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen">
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">Error loading pending payments</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Pending Manual Payments
      </h1>

      <div className="mb-6">
        <Search
          placeholder="SEARCH"
          onSearch={setSearchTerm}
          variant="primary"
        />
      </div>

      {filteredPayments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No pending payments found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPayments.map((payment) => (
            <div
              key={payment.paymentId}
              className="bg-gray-100 p-6 rounded-lg border border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Payment Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-black">Customer:</span>
                        <span className="text-gray-900">
                          {payment.customer}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-black">Email:</span>
                        <span className="text-gray-900">
                          {payment.customerEmail}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-black">Amount:</span>
                        <span className="text-gray-900">
                          ${payment.amount.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-black">Quote ID:</span>
                        <span className="text-gray-900">{payment.quoteId}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-black">
                          Total Coins:
                        </span>
                        <span className="text-gray-900">
                          {payment.quote.totalCoins}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-black">Uploaded:</span>
                        <span className="text-gray-900">
                          {formatDate(payment.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Payment Proof
                    </h3>
                    <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
                      <Image
                        src={payment.paymentProof}
                        alt="Payment proof"
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="primary"
                      onClick={() => handleApprove(payment)}
                      disabled={isApproving}
                      className="px-6 py-2 rounded-full text-sm"
                    >
                      {isApproving ? "Approving..." : "Approve Payment"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Approve Confirmation Modal */}
      {showApproveModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Approve Payment?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to approve this payment? This will create an
              order for the customer.
            </p>
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="font-semibold">Customer:</span>
                <span>{selectedPayment.customer}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Amount:</span>
                <span>${selectedPayment.amount.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button
                variant="ternary"
                onClick={() => {
                  setShowApproveModal(false);
                  setSelectedPayment(null);
                }}
                className="!bg-gray-200 rounded-full py-2 px-6 text-sm font-medium"
                disabled={isApproving}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmApprove}
                className="rounded-full py-2 px-6 text-sm font-medium"
                disabled={isApproving}
              >
                {isApproving ? "Approving..." : "Yes, Approve"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPendingPayments;
