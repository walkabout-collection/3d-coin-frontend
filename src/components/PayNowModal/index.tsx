import React, { useState } from "react";
import Button from "../common/button/Button";
import { OrderDataItem } from "@/src/containers/orders/types";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderDataItem;
  price: number;
  onConfirmPayment: (order: OrderDataItem) => void;
}

const PayNowModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  order,
  price,
  onConfirmPayment,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  if (!isOpen) return null;

  const adminAccountDetails = {
    bankName: "Example Bank",
    accountNumber: "1234567890",
    routingNumber: "0987654321",
    accountHolder: "Admin Name",
  };

  const handleConfirmClick = () => {
    setShowConfirmModal(true);
  };

  const handleFinalConfirm = () => {
    setShowConfirmModal(false);
    onConfirmPayment(order);
  };

  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-4">Manual Payment Details</h2>
        <p className="mb-2">
          <strong>Order No:</strong> {order.orderId}
        </p>
        <p className="mb-2">
          <strong>Amount:</strong> ${price.toFixed(2)}
        </p>
        <p className="mb-2">
          <strong>Bank Name:</strong> {adminAccountDetails.bankName}
        </p>
        <p className="mb-2">
          <strong>Account Number:</strong> {adminAccountDetails.accountNumber}
        </p>
        <p className="mb-2">
          <strong>Routing Number:</strong> {adminAccountDetails.routingNumber}
        </p>
        <p className="mb-4">
          <strong>Account Holder:</strong> {adminAccountDetails.accountHolder}
        </p>
        <p className="mb-4 text-sm text-gray-600">
          Please make the payment to the above account and click Confirm Payment
          to notify the admin.
        </p>
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="ternary"
            onClick={onClose}
            className="max-w-[200px] !bg-gray-200 rounded-full py-3 font-medium text-sm mt-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            onClick={handleConfirmClick}
            className="max-w-[200px] rounded-full py-3 font-base text-sm mt-6"
          >
            Confirm Payment
          </Button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-60">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-sm text-center">
            <h3 className="text-lg font-semibold mb-4">Are you sure?</h3>
            <p className="text-sm text-gray-600 mb-6">
              Do you want to confirm payment for{" "}
              <strong>Order #{order.orderId}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <Button
                variant="ternary"
                onClick={handleCancelConfirm}
                className="!bg-gray-200 rounded-full py-2 px-6 text-sm font-medium"
              >
                No, Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleFinalConfirm}
                className="rounded-full py-2 px-6 text-sm font-medium"
              >
                Yes, Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayNowModal;
