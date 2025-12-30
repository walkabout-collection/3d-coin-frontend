import { Payment } from "../admin/order-history/types";
import { Quote } from "../quotes/types";

export interface OrderDataItem {
  id: string;
  orderId: string; 
  orderDate: string;
  status: 'PENDING' | 'APPROVED' | 'CANCEL';
  totalCoins: number;
  totalPrice: number | null;
  weight: number | null;
  carrier: string | null;
  userId: string;
  quotes: Quote[];
  payments: Payment[]; 
}
