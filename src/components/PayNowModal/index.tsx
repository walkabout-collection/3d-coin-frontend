import React, { useState, useRef, useEffect } from "react";
import Button from "../common/button/Button";
import { OrderDataItem } from "@/src/containers/orders/types";
import { Quote } from "@/src/containers/quotes/types";
import { useCreateUserPayment } from "@/src/hooks/useQueries";
import { toast } from "react-toastify";
import { PaymentProofPreview } from "./PaymentProofPreview";
import { validateFile, validatePaymentAmount } from "@/src/utils/validation";
import { X } from "lucide-react";

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

  // Handle escape key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !showConfirmModal) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, showConfirmModal, onClose]);

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !showConfirmModal) {
      onClose();
    }
  };

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
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto transform transition-all animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900">
            Manual Payment Details
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
            disabled={uploading || isCreatingPayment}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span className="text-sm font-medium text-gray-700">
                Order No:
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {displayId}
              </span>
            </div>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span className="text-sm font-medium text-gray-700">Amount:</span>
              <span className="text-sm font-semibold text-gray-900">
                ${price.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200">
            <p className="text-sm font-semibold text-gray-900 mb-4">
              Bank Account Details
            </p>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700 font-medium">Bank Name:</span>
                <span className="font-semibold text-gray-900">
                  {adminAccountDetails.bankName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 font-medium">
                  Account Number:
                </span>
                <span className="font-semibold text-gray-900">
                  {adminAccountDetails.accountNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 font-medium">
                  Routing Number:
                </span>
                <span className="font-semibold text-gray-900">
                  {adminAccountDetails.routingNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 font-medium">
                  Account Holder:
                </span>
                <span className="font-semibold text-gray-900">
                  {adminAccountDetails.accountHolder}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload Payment Proof (Screenshot)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#1a2a3a] file:text-white hover:file:bg-[#2a3a4a] transition-colors cursor-pointer"
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

          <p className="mb-4 text-sm text-gray-700 leading-relaxed">
            Please make the payment to the above account, upload a screenshot of
            the payment confirmation, and click Confirm Payment to notify the
            admin.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="ternary"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 transition-colors"
              disabled={uploading || isCreatingPayment}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              onClick={handleConfirmClick}
              disabled={!selectedFile || uploading || isCreatingPayment}
              className="px-6 py-2.5 shadow-md hover:shadow-lg transition-shadow"
            >
              {uploading || isCreatingPayment
                ? "Uploading..."
                : "Confirm Payment"}
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm transform transition-all animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Are you sure?
              </h3>
              <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                Do you want to submit payment proof for{" "}
                <strong className="text-gray-900">Order #{displayId}</strong>?
              </p>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="ternary"
                  onClick={handleCancelConfirm}
                  className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 transition-colors"
                  disabled={uploading || isCreatingPayment}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleFinalConfirm}
                  className="px-6 py-2.5 shadow-md hover:shadow-lg transition-shadow"
                  disabled={uploading || isCreatingPayment}
                >
                  {uploading || isCreatingPayment ? "Submitting..." : "Confirm"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayNowModal;
