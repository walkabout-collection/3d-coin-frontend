// Payment Method Types
export type PaymentMethod = "STRIPE" | "MANUAL" | "QUICKBOOKS";

// Saved Payment Method
export interface SavedPaymentMethod {
  id: string;
  stripePaymentMethodId: string;
  brand: string | null;
  last4: string | null;
  isDefault: boolean;
  createdAt: string;
}

// Payment Preferences
export interface PaymentPreferences {
  preferredPaymentMethod: PaymentMethod | null;
  stripeCustomerId: string | null;
  savedPaymentMethods: SavedPaymentMethod[];
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
