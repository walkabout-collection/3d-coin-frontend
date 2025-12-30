"use client";
import React from "react";
import Image from "next/image";
import { useAdminQuoteById } from "@/src/hooks/useQueries";

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

interface Quote {
  orderId: string;
  status: string;
  method: string;
  totalCoins: number;
  feedback?: string;
  email: string;
  user?: User;
  packaging: boolean; 
  description?: string;
  createdAt: string;
}

interface UseAdminQuoteByIdResult {
  data?: Quote;
  isLoading: boolean;
  isError: boolean;
}

interface ViewQuoteModalProps {
  id: string;
  onClose: () => void;
}

const ViewQuoteModal: React.FC<ViewQuoteModalProps> = ({ id, onClose }) => {
  const { data: quote, isLoading, isError } = useAdminQuoteById(id) as UseAdminQuoteByIdResult;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-lg w-full relative shadow-md">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <Image
            src="/images/dashboard/cross-icon.svg"
            alt="Close"
            width={14}
            height={14}
          />
        </button>

        {isLoading ? (
          <p className="text-gray-500">Loading...</p>
        ) : isError ? (
          <p className="text-red-500">Failed to load quote</p>
        ) : quote ? (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Quote Details</h2>

            <div>
              <p>
                <span className="font-semibold">Order ID:</span>{" "}
                {quote.orderId} 
              </p>
              <p>
                <span className="font-semibold">Status:</span> {quote.status}
              </p>
              <p>
                <span className="font-semibold">Method:</span> {quote.method}
              </p>
              <p>
                <span className="font-semibold">Total Coins:</span>{" "}
                {quote.totalCoins}
              </p>
              <p>
                <span className="font-semibold">Feedback:</span>{" "}
                {quote.feedback || "-"}
              </p>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                {quote.user ? quote.user.email : quote.email}
              </p>
            </div>

            {quote.user && (
              <div>
                <h3 className="font-semibold text-gray-700">User</h3>
                <p>
                  {quote.user.firstName} {quote.user.lastName}
                </p>
              </div>
            )}

            <div>
              <h3 className="font-semibold ">Packaging</h3>
              <p>{quote.packaging ? "Yes" : "No"}</p>
              {quote.description && <p>{quote.description}</p>}
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Created At: {new Date(quote.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ViewQuoteModal;