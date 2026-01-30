/**
 * QuickBooks Connection Check Utility
 *
 * Optional helper function to check QuickBooks connections after OAuth completion
 * Call this after user returns to dashboard to confirm connection
 */

import { getAdminQuickBooksConnections } from "@/src/services/apiServices";

/**
 * Check QuickBooks connections (Admin endpoint)
 *
 * @returns Promise with connections data
 *
 * @example
 * ```typescript
 * async function checkConnection() {
 *   const data = await checkQuickBooksConnection();
 *   console.log("QuickBooks connections:", data.data);
 * }
 * ```
 */
export async function checkQuickBooksConnection() {
  try {
    const response = await getAdminQuickBooksConnections();
    if (response.success) {
      console.log("QuickBooks connections:", response.data);
      return response;
    } else {
      console.error("Failed to check connections:", response.message);
      return response;
    }
  } catch (error) {
    console.error("Error checking QuickBooks connections:", error);
    throw error;
  }
}

/**
 * Check if current user has QuickBooks connection
 *
 * @param userId - Optional user ID to check specific user
 * @returns Promise with boolean indicating if user is connected
 */
export async function isUserConnected(userId?: string): Promise<boolean> {
  try {
    const response = await checkQuickBooksConnection();
    if (!response.success || !response.data) {
      return false;
    }

    // If userId provided, check specific user
    if (userId) {
      return response.data.some((connection) => connection.userId === userId);
    }

    // Otherwise, check if any connections exist
    return response.data.length > 0;
  } catch (error) {
    console.error("Error checking user connection:", error);
    return false;
  }
}
