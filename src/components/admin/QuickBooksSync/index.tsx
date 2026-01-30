"use client";
import React, { useState, useMemo } from "react";
import {
  useAdminQuickBooksSyncStatus,
  useSyncAdminQuickBooksPayment,
  useRetryAdminQuickBooksFailedSyncs,
  useAdminQuickBooksConnections,
} from "@/src/hooks/useQueries";
import {
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Button from "@/src/components/common/button/Button";
import Table from "@/src/components/common/Table";
import { TableColumn } from "@/src/components/common/Table/types";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";

const QuickBooksSync: React.FC = () => {
  const {
    data: syncStatusData,
    isLoading,
    isError,
    refetch,
  } = useAdminQuickBooksSyncStatus();

  const { data: connectionsData } = useAdminQuickBooksConnections();
  const syncPayment = useSyncAdminQuickBooksPayment();
  const retryFailedSyncs = useRetryAdminQuickBooksFailedSyncs();
  const [syncingPaymentId, setSyncingPaymentId] = useState<string | null>(null);

  // Create a map of userId -> hasConnection for quick lookup
  const userConnectionsMap = useMemo(() => {
    const map = new Map<string, boolean>();
    if (connectionsData?.data) {
      connectionsData.data.forEach((connection) => {
        map.set(connection.userId, !connection.isExpired);
      });
    }
    return map;
  }, [connectionsData]);

  const handleSyncPayment = async (paymentId: string, userId: string) => {
    // Check if user has QuickBooks connection before syncing
    const hasConnection = userConnectionsMap.get(userId);
    if (!hasConnection) {
      toast.error(
        "Cannot sync: This user's QuickBooks account is not connected. Please ask them to connect their QuickBooks account first.",
        {
          autoClose: 6000,
        },
      );
      return;
    }

    setSyncingPaymentId(paymentId);
    try {
      await syncPayment.mutateAsync(paymentId);
      toast.success("Payment synced successfully");
      refetch();
    } catch (error: unknown) {
      let errorMessage = "Failed to sync payment";

      // Check if it's an AxiosError with response data
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as AxiosError<{
          message?: string;
          code?: string;
        }>;
        const responseData = axiosError.response?.data;
        const responseMessage = responseData?.message;
        const errorCode = responseData?.code;

        if (responseMessage) {
          errorMessage = responseMessage;
        }

        // Handle specific error codes
        if (
          errorCode === "ERR_6001" ||
          errorMessage?.includes("not connected") ||
          errorMessage?.includes("No user with QuickBooks connection")
        ) {
          errorMessage =
            "Cannot sync: User's QuickBooks account is not connected. The user needs to connect their QuickBooks account first. You can check connections in the 'Connections' tab.";
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;

        // Check for specific error messages
        if (
          errorMessage.includes("not connected") ||
          errorMessage.includes("ERR_6001") ||
          errorMessage.includes("No user with QuickBooks connection")
        ) {
          errorMessage =
            "Cannot sync: User's QuickBooks account is not connected. The user needs to connect their QuickBooks account first. You can check connections in the 'Connections' tab.";
        }
      }

      toast.error(errorMessage, {
        autoClose: 6000,
      });
    } finally {
      setSyncingPaymentId(null);
    }
  };

  const handleRetryAll = async (): Promise<void> => {
    try {
      const result = await retryFailedSyncs.mutateAsync();
      const successCount = result.data.succeeded || 0;
      const failedCount = result.data.failed || 0;

      if (successCount > 0 && failedCount === 0) {
        toast.success(`All ${successCount} payment(s) synced successfully!`);
      } else if (successCount > 0 && failedCount > 0) {
        toast.warning(
          `Retry complete: ${successCount} succeeded, ${failedCount} failed. Check the error log for details.`,
          { autoClose: 6000 },
        );
      } else if (failedCount > 0) {
        toast.error(
          `All ${failedCount} payment(s) failed to sync. Check the error log for details.`,
          { autoClose: 6000 },
        );
      } else {
        toast.info("No payments to retry.");
      }
      refetch();
    } catch (error: unknown) {
      let errorMessage = "Failed to retry syncs";

      // Check if it's an AxiosError with response data
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        const responseMessage = axiosError.response?.data?.message;
        if (responseMessage) {
          errorMessage = responseMessage;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        autoClose: 5000,
      });
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Never";
    try {
      return new Date(dateString).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SYNCED":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Synced
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Not Synced
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-10 w-10 animate-spin text-[#1a2a3a] mb-4" />
        <p className="text-gray-700 font-medium">Loading sync status...</p>
      </div>
    );
  }

  if (isError || !syncStatusData?.data) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto bg-white border border-red-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Failed to Load Sync Status
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Unable to load QuickBooks sync status. Please try again.
              </p>
              <Button
                variant="primary"
                onClick={() => refetch()}
                className="shadow-md hover:shadow-lg transition-shadow"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const syncStatus = syncStatusData.data;
  const payments = syncStatus.payments || [];

  const paymentColumns: TableColumn<(typeof payments)[0]>[] = [
    {
      key: "userName",
      label: "User",
      width: "w-40",
      render: (_value, row) => (
        <div>
          <div className="font-medium">{row.userName}</div>
          {row.userEmail && (
            <div className="text-sm text-gray-500">{row.userEmail}</div>
          )}
        </div>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      width: "w-24",
      render: (value) => `$${(value as number).toFixed(2)}`,
    },
    {
      key: "status",
      label: "Status",
      width: "w-24",
      render: (_value, row) => (
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            row.status === "SUCCESS"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "syncStatus",
      label: "Sync Status",
      width: "w-32",
      render: (_value, row) => getStatusBadge(row.syncStatus),
    },
    {
      key: "invoiceId",
      label: "Invoice ID",
      width: "w-32",
      render: (_value, row) =>
        row.invoiceId ? (
          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
            {row.invoiceId}
          </code>
        ) : (
          <span className="text-gray-400">N/A</span>
        ),
    },
    {
      key: "lastSyncAt",
      label: "Last Sync",
      width: "w-32",
      render: (_value, row) => formatDate(row.lastSyncAt),
    },
    {
      key: "actions",
      label: "Actions",
      width: "w-24",
      render: (_value, row) => {
        const hasConnection = userConnectionsMap.get(row.userId);
        const isDisabled = !hasConnection || syncingPaymentId === row.paymentId;
        const isSyncing = syncingPaymentId === row.paymentId;

        return (
          <div
            className="relative group"
            title={
              !hasConnection
                ? "User's QuickBooks account is not connected"
                : undefined
            }
          >
            <Button
              variant="ternary"
              onClick={() => handleSyncPayment(row.paymentId, row.userId)}
              disabled={isDisabled}
              className="text-xs !px-2 !py-1"
            >
              {isSyncing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
            {!hasConnection && (
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg">
                  User not connected
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Sync Status Overview */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            Sync Status Overview
          </h3>
          <div className="flex gap-3">
            <Button
              variant="ternary"
              onClick={() => refetch()}
              disabled={isLoading}
              className="text-sm !px-4 !py-2 border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            {syncStatus.statusCounts.FAILED > 0 && (
              <Button
                variant="primary"
                onClick={handleRetryAll}
                disabled={retryFailedSyncs.isPending}
                className="text-sm !px-4 !py-2 shadow-md hover:shadow-lg transition-shadow"
              >
                {retryFailedSyncs.isPending ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Retry All Failed ({syncStatus.statusCounts.FAILED})
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-5 border border-gray-200 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {syncStatus.total}
            </div>
            <div className="text-sm font-semibold text-gray-700">
              Total Payments
            </div>
          </div>
          <div className="text-center p-5 border border-green-200 rounded-xl bg-gradient-to-br from-green-50 to-green-100">
            <div className="text-3xl font-bold text-green-700 mb-1">
              {syncStatus.statusCounts.SYNCED}
            </div>
            <div className="text-sm font-semibold text-green-700">Synced</div>
          </div>
          <div className="text-center p-5 border border-yellow-200 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100">
            <div className="text-3xl font-bold text-yellow-700 mb-1">
              {syncStatus.statusCounts.PENDING}
            </div>
            <div className="text-sm font-semibold text-yellow-700">Pending</div>
          </div>
          <div className="text-center p-5 border border-red-200 rounded-xl bg-gradient-to-br from-red-50 to-red-100">
            <div className="text-3xl font-bold text-red-700 mb-1">
              {syncStatus.statusCounts.FAILED}
            </div>
            <div className="text-sm font-semibold text-red-700">Failed</div>
          </div>
        </div>
      </div>

      {/* Payment Sync Details */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Payment Sync Details
        </h3>
        {payments.length === 0 ? (
          <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-700 font-medium">No payments found</p>
            <p className="text-sm text-gray-600 mt-2">
              No payment sync records available.
            </p>
          </div>
        ) : (
          <Table columns={paymentColumns} data={payments} />
        )}
      </div>
    </div>
  );
};

export default QuickBooksSync;
