import React, { useState, useRef } from "react";
import Button from "../common/button/Button";
import { OrderDataItem } from "@/src/containers/orders/types";
import { Quote } from "@/src/containers/quotes/types";
import { useCreateUserPayment } from "@/src/hooks/useQueries";
import { toast } from "react-toastify";
import { PaymentProofPreview } from "./PaymentProofPreview";
import { validateFile, validatePaymentAmount } from "@/src/utils/validation";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: OrderDataItem;
  quote?: Quote;
  price: number;
  onConfirmPayment?: (order: OrderDataItem) => void;
  onPaymentSuccess?: () => void;
}

const PayNowModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  order,
  quote,
  price,
  // removed unused onConfirmPayment
  onPaymentSuccess,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: createUserPayment, isPending: isCreatingPayment } =
    useCreateUserPayment({
      onSuccess: () => {
        toast.success(
          "Payment proof uploaded successfully. Waiting for admin verification.",
        );
        setSelectedFile(null);
        setPreview(null);
        setShowConfirmModal(false);
        if (onPaymentSuccess) {
          onPaymentSuccess();
        }
        onClose();
      },
      onError: (error) => {
        const msg = error instanceof Error ? error.message : String(error);
        console.error("Error uploading payment proof:", error);
        toast.error(msg || "Failed to upload payment proof. Please try again.");
        setUploading(false);
      },
    });

  if (!isOpen) return null;

  const adminAccountDetails = {
    bankName: "Example Bank",
    accountNumber: "1234567890",
    routingNumber: "0987654321",
    accountHolder: "Admin Name",
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to convert file to base64"));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateFile(file);
      if (!validation.valid) {
        toast.error(validation.error || "Invalid file");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmClick = () => {
    if (!selectedFile) {
      toast.error("Please upload a payment proof screenshot");
      return;
    }
    setShowConfirmModal(true);
  };

  const validateAmount = (): boolean => {
    // Validate amount matches quote amount if quote is available
    if (quote && quote.amount) {
      const validation = validatePaymentAmount(price, quote.amount);
      if (!validation.valid) {
        toast.warning(validation.error || "Amount validation failed");
        return false;
      }
    }
    return true;
  };

  const handleFinalConfirm = async () => {
    if (!selectedFile) {
      toast.error("Please upload a payment proof screenshot");
      return;
    }

    // Validate amount
    if (!validateAmount()) {
      return;
    }

    setUploading(true);
    try {
      const base64Image = await convertToBase64(selectedFile);

      // Use quote if available, otherwise use order
      const quoteId = quote?.id || order?.quotes?.[0]?.id;
      if (!quoteId) {
        toast.error("Quote ID is missing");
        setUploading(false);
        return;
      }

      createUserPayment({
        quoteId,
        amount: price,
        method: "MANUAL",
        paymentProof: base64Image,
      });
    } catch (error) {
      console.error("Error converting file to base64:", error);
      toast.error("Failed to process image. Please try again.");
      setUploading(false);
    }
  };

  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const displayId = quote?.orderId || order?.orderId || "N/A";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Manual Payment Details</h2>
        <div className="space-y-3 mb-4">
          <p className="mb-2">
            <strong>Order No:</strong> {displayId}
          </p>
          <p className="mb-2">
            <strong>Amount:</strong> ${price.toFixed(2)}
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-sm font-semibold mb-2">Bank Account Details:</p>
            <p className="mb-1 text-sm">
              <strong>Bank Name:</strong> {adminAccountDetails.bankName}
            </p>
            <p className="mb-1 text-sm">
              <strong>Account Number:</strong>{" "}
              {adminAccountDetails.accountNumber}
            </p>
            <p className="mb-1 text-sm">
              <strong>Routing Number:</strong>{" "}
              {adminAccountDetails.routingNumber}
            </p>
            <p className="mb-1 text-sm">
              <strong>Account Holder:</strong>{" "}
              {adminAccountDetails.accountHolder}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Payment Proof (Screenshot)
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {preview && (
            <div className="mt-4">
              <PaymentProofPreview
                proof={preview}
                onRemove={handleRemoveFile}
                onError={(error) => {
                  toast.error(error);
                  handleRemoveFile();
                }}
              />
            </div>
          )}
        </div>

        <p className="mb-4 text-sm text-gray-600">
          Please make the payment to the above account, upload a screenshot of
          the payment confirmation, and click Confirm Payment to notify the
          admin.
        </p>
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="ternary"
            onClick={onClose}
            className="max-w-[200px] !bg-gray-200 rounded-full py-3 font-medium text-sm"
            disabled={uploading || isCreatingPayment}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            onClick={handleConfirmClick}
            disabled={!selectedFile || uploading || isCreatingPayment}
            className="max-w-[200px] rounded-full py-3 font-base text-sm"
          >
            {uploading || isCreatingPayment
              ? "Uploading..."
              : "Confirm Payment"}
          </Button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60]">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-sm text-center">
            <h3 className="text-lg font-semibold mb-4">Are you sure?</h3>
            <p className="text-sm text-gray-600 mb-6">
              Do you want to submit payment proof for{" "}
              <strong>Order #{displayId}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <Button
                variant="ternary"
                onClick={handleCancelConfirm}
                className="!bg-gray-200 rounded-full py-2 px-6 text-sm font-medium"
                disabled={uploading || isCreatingPayment}
              >
                No, Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleFinalConfirm}
                className="rounded-full py-2 px-6 text-sm font-medium"
                disabled={uploading || isCreatingPayment}
              >
                {uploading || isCreatingPayment
                  ? "Submitting..."
                  : "Yes, Confirm"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayNowModal;
