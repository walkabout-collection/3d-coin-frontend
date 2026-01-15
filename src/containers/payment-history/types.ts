export interface PaymentDataItem {
  paymentMethod: string;
  order: string;
  total: string;
  date: string;
}

// API Response Types
export interface PaymentHistoryItem {
  orderId: string;
  paymentMethod: string;
  total: number;
  date: string;
  status?: string;
  paymentId?: string;
}

export interface PaymentHistoryResponse {
  success: boolean;
  data: PaymentHistoryItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
