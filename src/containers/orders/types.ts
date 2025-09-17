export interface OrderDataItem {
  trackingNo: string;
  packaging: string;
  order: string;
  date: string;
  paymentMethod: 'MANUAL' | 'QUICKBOOKS' | 'PAYPAL';
  status: 'PENDING' | 'APPROVED' | 'CANCEL';
  price: number; 
}