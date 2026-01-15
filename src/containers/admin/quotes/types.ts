import { User } from "@/src/services/api/apiTypes";

export interface Payment {
  id: string;
  orderId: string;
  quoteId: string;
  userId?: string;
  method: string;
  status: string;
  amount: number;
  paidAt?: string | null;
  createdAt: string;
  paymentProof?: string | null;
  stripeCheckoutSessionId?: string | null;
  stripeCustomerId?: string | null;
  quickbooksInvoiceId?: string | null;
  quickbooksSyncStatus?: string | null;
  quickbooksLastSyncAt?: string | null;
  idempotencyKey?: string;
  receiptUrl?: string | null;
  receiptGeneratedAt?: string | null;
}

export interface Quote {
  status: string;
  user: User | null;
  orderId: string | null;
  id: string;
  name?: string;
  orderNo?: string;
  email: string;
  label?: string;
  createdAt: string;
  totalCoins?: number;
  isPaid?: boolean;
  paymentStatus?: string;
  Payment?: Payment[];
  designStatus?: string;
  userId?: string | null;
  amount?: number | null;
  feedback?: string | null;
  method?: string;
  coinDesignId?: string;
  packagingId?: string | null;
  User?: User | null;
  Order?: {
    id: string;
    userId: string | null;
    carrier: string | null;
    status: string;
    weight: number | null;
    orderDate: string;
    totalCoins: number;
    totalPrice: number;
    orderId: string;
  } | null;
  Packaging?: {
    id: string;
    description: string | null;
    referenceImg: string | null;
    text: string | null;
    createdAt: string;
    userId: string | null;
  } | null;
}
