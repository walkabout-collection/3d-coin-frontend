export interface PaymentDataItem {
  paymentMethod: string;
  orderId: string;
  date: string;

  orderTotal?: string;
  order?: string;
  customer?: string;
  customerEmail?: string;
  status?: string;
}
