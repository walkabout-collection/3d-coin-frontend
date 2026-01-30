/**
 * QuickBooks Error Messages
 * Maps common error codes and messages to user-friendly messages
 */

export const QuickBooksErrorMessages: Record<
  number,
  Record<string, string> & { default?: string }
> = {
  400: {
    "Quote not approved":
      "The quote must be approved before creating an invoice.",
    "QuickBooks not connected": "Please connect your QuickBooks account first.",
    "Payment already completed": "This quote already has a completed payment.",
    "Cannot sync payment":
      "Cannot sync payment. Please ensure your QuickBooks account is connected.",
    "No user with QuickBooks connection found":
      "No QuickBooks connection found. Please connect your QuickBooks account first.",
    default: "Invalid request. Please check your input and try again.",
  },
  401: {
    default: "You must be logged in to use QuickBooks features.",
  },
  403: {
    default: "You don't have permission to perform this action.",
  },
  404: {
    default: "Quote not found or you do not have access.",
  },
  500: {
    "QuickBooks API error":
      "An error occurred with QuickBooks. Please try again later.",
    "Failed to create invoice":
      "Could not create invoice in QuickBooks. Please check your connection.",
    "Failed to sync payment":
      "Failed to sync payment. Please ensure your QuickBooks account is connected and try again.",
    "OAuth configuration error":
      "QuickBooks OAuth configuration error. Please verify backend environment variables (CLIENT_ID, CLIENT_SECRET, REDIRECT_URI) match Developer Portal settings.",
    "Invalid redirect URI":
      "Redirect URI mismatch. Please ensure the redirect URI in backend matches exactly with Developer Portal (case-sensitive, no trailing slashes).",
    default: "An unexpected error occurred. Please try again later.",
  },
};

/**
 * Get user-friendly error message from error object
 */
export const getQuickBooksErrorMessage = (error: unknown): string => {
  // Handle different error types
  let status: number | undefined;
  let message: string | undefined;

  if (error && typeof error === "object") {
    // Check for axios error structure
    if ("response" in error) {
      const axiosError = error as {
        response?: {
          status?: number;
          data?: { message?: string; code?: string };
        };
        message?: string;
      };
      status = axiosError.response?.status;
      const responseData = axiosError.response?.data;
      message = responseData?.message || axiosError.message || "Unknown error";

      // Handle specific error codes
      if (responseData?.code === "ERR_6001") {
        return "Your QuickBooks account is not connected. Please connect your QuickBooks account first before syncing.";
      }

      // Check for company ID in error message (specific sync error)
      if (
        message &&
        (message.includes("company ID") ||
          message.includes("No user with QuickBooks connection"))
      ) {
        return "No QuickBooks connection found. Please connect your QuickBooks account first. If you're an admin, ensure at least one user has connected their QuickBooks account.";
      }
    }
    // Check for standard Error object
    else if ("message" in error) {
      message = (error as Error).message;
    }
  } else if (typeof error === "string") {
    message = error;
  }

  // Default to 500 if no status found
  status = status || 500;

  // Get error message from mapping
  if (status in QuickBooksErrorMessages) {
    const statusMessages = QuickBooksErrorMessages[status];

    // Check for partial matches in error messages
    if (message) {
      // Check for specific error patterns
      for (const [key, value] of Object.entries(statusMessages)) {
        if (key !== "default" && message.includes(key)) {
          return value;
        }
      }

      // Check exact match
      if (message in statusMessages) {
        return statusMessages[message];
      }
    }

    if (statusMessages.default) {
      return statusMessages.default;
    }
  }

  // Fallback to provided message or generic error
  return message || "An unexpected error occurred. Please try again.";
};
