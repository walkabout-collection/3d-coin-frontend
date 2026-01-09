export interface PaymentDataItem {
  paymentMethod: string;
  originalPaymentMethod?: string; // Store original payment method (STRIPE, MANUAL, QUICKBOOKS) for status edit check
  orderId: string;
  date: string;

  orderTotal?: string;
  order?: string;
  customer?: string;
  customerEmail?: string;
  status?: string;
}
