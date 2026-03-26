/**
 * Comprehensive QuickBooks Hook
 * Provides a unified interface for QuickBooks operations
 */

import { useEffect, useCallback } from "react";
import {
  useQuickBooksStatus,
  useDisconnectQuickBooks,
  useCreateQuickBooksInvoiceForQuote,
  useQuickBooksTransactions,
  useSyncQuickBooksTransactions,
} from "./useQueries";
import { getQuickBooksErrorMessage } from "@/src/utils/quickbooksErrors";
import { toast } from "react-toastify";
import { beginQuickBooksConnect } from "@/src/utils/quickbooksOAuth";

interface UseQuickBooksOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
  onConnectionChange?: (connected: boolean) => void;
}

export const useQuickBooks = (options: UseQuickBooksOptions = {}) => {
  const {
    autoRefresh = false,
    refreshInterval = 30000, // 30 seconds
    onConnectionChange,
  } = options;
  // Connection initiation is handled via authenticated XHR + redirect (see beginQuickBooksConnect)

  // Status query
  const {
    data: statusData,
    isLoading: statusLoading,
    error: statusError,
    refetch: refetchStatus,
  } = useQuickBooksStatus({
    refetchInterval: autoRefresh ? refreshInterval : false,
  });

  const isConnecting = false;
  const connectError = undefined;

  const {
    mutate: disconnect,
    isPending: isDisconnecting,
    error: disconnectError,
  } = useDisconnectQuickBooks({
    onSuccess: () => {
      toast.success("QuickBooks disconnected successfully");
      refetchStatus();
      onConnectionChange?.(false);
    },
    onError: (error) => {
      const errorMsg = getQuickBooksErrorMessage(error);
      toast.error(errorMsg);
    },
  });

  // Invoice creation
  const {
    mutate: createInvoice,
    isPending: isCreatingInvoice,
    error: createInvoiceError,
  } = useCreateQuickBooksInvoiceForQuote({
    onSuccess: (response) => {
      if (response.success) {
        toast.success(
          response.data?.message ||
            "Invoice created successfully in QuickBooks!",
        );
      } else {
        const errorMsg =
          response.message || "Failed to create invoice in QuickBooks";
        toast.error(errorMsg);
      }
    },
    onError: (error) => {
      const errorMsg = getQuickBooksErrorMessage(error);
      toast.error(errorMsg);
    },
  });

  // Transactions
  const {
    data: transactionsData,
    isLoading: transactionsLoading,
    error: transactionsError,
    refetch: refetchTransactions,
  } = useQuickBooksTransactions();

  // Sync
  const {
    mutate: syncTransactions,
    isPending: isSyncing,
    error: syncError,
  } = useSyncQuickBooksTransactions({
    onSuccess: (response) => {
      if (response.success) {
        toast.success(
          `Synced ${response.data?.syncedCount || 0} transactions successfully`,
        );
        refetchTransactions();
      } else {
        const errorMsg = getQuickBooksErrorMessage(
          new Error(response.message || "Failed to sync transactions"),
        );
        toast.error(errorMsg);
      }
    },
    onError: (error) => {
      const errorMsg = getQuickBooksErrorMessage(error);
      toast.error(errorMsg);
    },
  });

  // Derived state
  const status = statusData?.data;
  const isConnected = status?.connected ?? false;
  const isExpired = status?.expired ?? false;
  const connectedAt = status?.connectedAt;
  const expiresAt = status?.expiresAt;

  // Handlers
  const handleConnect = useCallback(() => {
    // Fire and forget: this will redirect the browser on success
    beginQuickBooksConnect({ returnTo: window.location.href }).catch((e) => {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(msg || "Failed to start QuickBooks connection");
    });
  }, []);

  const handleDisconnect = useCallback(() => {
    if (
      window.confirm(
        "Are you sure you want to disconnect your QuickBooks account? You will need to reconnect to access QuickBooks features.",
      )
    ) {
      disconnect();
    }
  }, [disconnect]);

  const handleCreateInvoice = useCallback(
    (params: {
      quoteId: string;
      amount: number;
      customerEmail: string;
      customerName?: string;
    }) => {
      createInvoice(params);
    },
    [createInvoice],
  );

  const handleSyncTransactions = useCallback(() => {
    // Check if connected before syncing
    if (!isConnected || isExpired) {
      toast.error(
        "Please connect your QuickBooks account first before syncing transactions.",
      );
      return;
    }
    syncTransactions();
  }, [syncTransactions, isConnected, isExpired]);

  // Effect to notify connection changes
  useEffect(() => {
    if (statusData?.data) {
      onConnectionChange?.(statusData.data.connected);
    }
  }, [statusData?.data, onConnectionChange]);

  return {
    // Status
    status,
    isConnected,
    isExpired,
    connectedAt,
    expiresAt,
    statusLoading,
    statusError,

    // Connection
    connect: handleConnect,
    disconnect: handleDisconnect,
    isConnecting,
    isDisconnecting,
    connectError,
    disconnectError,

    // Invoice
    createInvoice: handleCreateInvoice,
    isCreatingInvoice,
    createInvoiceError,

    // Transactions
    transactions: transactionsData?.data?.transactions || [],
    transactionsLoading,
    transactionsError,
    refetchTransactions,

    // Sync
    syncTransactions: handleSyncTransactions,
    isSyncing,
    syncError,

    // Utilities
    refetchStatus,
  };
};
