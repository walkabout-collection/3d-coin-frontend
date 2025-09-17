import React from 'react';
import Button from '../common/button/Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackingNo: string;
  price: number;
  onConfirmPayment: (trackingNo: string) => void;
}

const PayNowModal: React.FC<ModalProps> = ({ isOpen, onClose, trackingNo, price, onConfirmPayment }) => {
  if (!isOpen) return null;

  const adminAccountDetails = {
    bankName: 'Example Bank',
    accountNumber: '1234567890',
    routingNumber: '0987654321',
    accountHolder: 'Admin Name',
  };

  const handleConfirmPayment = async () => {
    try {
      await fetch('/api/notify-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingNo, paymentMethod: 'MANUAL', price }),
      });
      onConfirmPayment(trackingNo); 
      onClose();
    } catch (error) {
      console.error('Error notifying admin:', error);
      alert('Failed to notify admin. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-4">Manual Payment Details</h2>
        <p className="mb-2"><strong>Order No:</strong> {trackingNo}</p>
        <p className="mb-2"><strong>Amount:</strong> ${price.toFixed(2)}</p>
        <p className="mb-2"><strong>Bank Name:</strong> {adminAccountDetails.bankName}</p>
        <p className="mb-2"><strong>Account Number:</strong> {adminAccountDetails.accountNumber}</p>
        <p className="mb-2"><strong>Routing Number:</strong> {adminAccountDetails.routingNumber}</p>
        <p className="mb-4"><strong>Account Holder:</strong> {adminAccountDetails.accountHolder}</p>
        <p className="mb-4 text-sm text-gray-600">
          Please make the payment to the above account and click "Confirm Payment" to notify the admin.
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
            onClick={handleConfirmPayment}
            className="max-w-[200px] rounded-full py-3 font-base text-sm mt-6"
          >
            Confirm Payment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PayNowModal;