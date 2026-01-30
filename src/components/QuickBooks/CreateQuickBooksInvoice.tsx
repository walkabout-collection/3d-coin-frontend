"use client";
import React, { useState } from "react";
import { useCreateQuickBooksInvoiceForQuote } from "@/src/hooks/useQueries";
import { toast } from "react-toastify";
import Button from "../common/button/Button";
import { FileText, Loader2 } from "lucide-react";

interface CreateQuickBooksInvoiceProps {
  quoteId: string;
  amount: number;
  customerEmail: string;
  customerName?: string;
  onSuccess?: (paymentId: string, invoiceId: string) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
}

const CreateQuickBooksInvoice: React.FC<CreateQuickBooksInvoiceProps> = ({
  quoteId,
  amount,
  customerEmail,
  customerName,
  onSuccess,
  onError,
  disabled = false,
}) => {
  const [isCreating, setIsCreating] = useState(false);

  const { mutate: createInvoice, isPending } =
    useCreateQuickBooksInvoiceForQuote({
      onSuccess: (response) => {
        setIsCreating(false);
        if (response.success) {
          toast.success(
            response.data?.message ||
              "Invoice created successfully in QuickBooks!",
          );
          if (response.data) {
            onSuccess?.(response.data.paymentId, response.data.invoiceId);
          }
        } else {
          const errorMsg =
            response.message || "Failed to create invoice in QuickBooks";
          toast.error(errorMsg);
          onError?.(errorMsg);
        }
      },
      onError: (error) => {
        setIsCreating(false);
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        toast.error(errorMessage || "Failed to create invoice");
        onError?.(errorMessage);
      },
    });

  const handleCreateInvoice = () => {
    if (
      !window.confirm(
        "Create invoice in QuickBooks? The invoice will be created and payment will be synced automatically.",
      )
    ) {
      return;
    }

    setIsCreating(true);
    createInvoice({
      quoteId,
      amount,
      customerEmail,
      customerName,
    });
  };

  const isLoading = isPending || isCreating;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <FileText className="h-5 w-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1">
            Create QuickBooks Invoice
          </h4>
          <p className="text-sm text-gray-600 mb-3">
            Create an invoice in QuickBooks for this quote. Payment will be
            synced automatically when received.
          </p>
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Amount:</span>
              <span className="font-semibold text-gray-900">
                ${amount.toFixed(2)}
              </span>
            </div>
            {customerName && (
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Customer:</span>
                <span className="text-gray-900">{customerName}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Email:</span>
              <span className="text-gray-900">{customerEmail}</span>
            </div>
          </div>
          <Button
            variant="primary"
            onClick={handleCreateInvoice}
            disabled={disabled || isLoading}
            className="w-full shadow-md hover:shadow-lg transition-shadow"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating Invoice...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Create QuickBooks Invoice
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuickBooksInvoice;
