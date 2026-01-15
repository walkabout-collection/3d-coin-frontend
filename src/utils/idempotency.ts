/**
 * Generate a unique idempotency key for payment requests
 * Format: stripe-{quoteId}-{timestamp}
 */
export const generateIdempotencyKey = (quoteId: string): string => {
  return `stripe-${quoteId}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
};

/**
 * Store idempotency key in session storage to prevent duplicates
 */
export const storeIdempotencyKey = (quoteId: string, key: string): void => {
  try {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(`idempotency-${quoteId}`, key);
    }
  } catch (error) {
    console.error("Failed to store idempotency key:", error);
  }
};

/**
 * Get stored idempotency key for a quote
 */
export const getIdempotencyKey = (quoteId: string): string | null => {
  try {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem(`idempotency-${quoteId}`);
    }
  } catch (error) {
    console.error("Failed to get idempotency key:", error);
  }
  return null;
};

/**
 * Clear idempotency key after successful payment
 */
export const clearIdempotencyKey = (quoteId: string): void => {
  try {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(`idempotency-${quoteId}`);
    }
  } catch (error) {
    console.error("Failed to clear idempotency key:", error);
  }
};
