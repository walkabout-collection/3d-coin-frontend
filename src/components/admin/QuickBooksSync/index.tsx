"use client";
import React, { useState } from "react";
import {
  useAdminQuickBooksSyncStatus,
  useSyncAdminQuickBooksPayment,
  useRetryAdminQuickBooksFailedSyncs,
} from "@/src/hooks/useQueries";
import {
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import Button from "@/src/components/common/button/Button";
import Table from "@/src/components/common/Table";
import { TableColumn } from "@/src/components/common/Table/types";
import { toast } from "react-toastify";

const QuickBooksSync: React.FC = () => {
  const {
    data: syncStatusData,
    isLoading,
    isError,
    refetch,
  } = useAdminQuickBooksSyncStatus();

  const syncPayment = useSyncAdminQuickBooksPayment();
  const retryFailedSyncs = useRetryAdminQuickBooksFailedSyncs();
  const [syncingPaymentId, setSyncingPaymentId] = useState<string | null>(null);

  const handleSyncPayment = async (paymentId: string) => {
    setSyncingPaymentId(paymentId);
    try {
      await syncPayment.mutateAsync(paymentId);
      toast.success("Payment synced successfully");
      refetch();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to sync payment";
      toast.error(errorMessage);
    } finally {
      setSyncingPaymentId(null);
    }
  };

  const handleRetryAll = async () => {
    try {
      const result = await retryFailedSyncs.mutateAsync();
      toast.success(
        `Retry complete: ${result.data.succeeded} succeeded, ${result.data.failed} failed`,
      );
      refetch();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to retry syncs";
      toast.error(errorMessage);
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
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading sync status...</span>
      </div>
    );
  }

  if (isError || !syncStatusData?.data) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Failed to load sync status</p>
        <Button variant="primary" onClick={() => refetch()} className="text-sm">
          Retry
        </Button>
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
      render: (_value, row) => (
        <Button
          variant="ternary"
          onClick={() => handleSyncPayment(row.paymentId)}
          disabled={syncingPaymentId === row.paymentId}
          className="text-xs !px-2 !py-1"
        >
          {syncingPaymentId === row.paymentId ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Sync Status Overview */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Sync Status Overview
          </h3>
          <div className="flex gap-2">
            <Button
              variant="ternary"
              onClick={() => refetch()}
              disabled={isLoading}
              className="text-sm !px-3 !py-2"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            {syncStatus.statusCounts.FAILED > 0 && (
              <Button
                variant="primary"
                onClick={handleRetryAll}
                disabled={retryFailedSyncs.isPending}
                className="text-sm !px-3 !py-2"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry All Failed ({syncStatus.statusCounts.FAILED})
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold">{syncStatus.total}</div>
            <div className="text-sm text-gray-600">Total Payments</div>
          </div>
          <div className="text-center p-4 border rounded-lg bg-green-50">
            <div className="text-2xl font-bold text-green-600">
              {syncStatus.statusCounts.SYNCED}
            </div>
            <div className="text-sm text-gray-600">Synced</div>
          </div>
          <div className="text-center p-4 border rounded-lg bg-yellow-50">
            <div className="text-2xl font-bold text-yellow-600">
              {syncStatus.statusCounts.PENDING}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="text-center p-4 border rounded-lg bg-red-50">
            <div className="text-2xl font-bold text-red-600">
              {syncStatus.statusCounts.FAILED}
            </div>
            <div className="text-sm text-gray-600">Failed</div>
          </div>
        </div>
      </div>

      {/* Payment Sync Details */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Payment Sync Details
        </h3>
        {payments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No payments found
          </div>
        ) : (
          <Table columns={paymentColumns} data={payments} />
        )}
      </div>
    </div>
  );
};

export default QuickBooksSync;
