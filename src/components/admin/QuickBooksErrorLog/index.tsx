"use client";
import React from "react";
import { useAdminQuickBooksErrors } from "@/src/hooks/useQueries";
import { AlertCircle, CheckCircle } from "lucide-react";
import Button from "@/src/components/common/button/Button";

const QuickBooksErrorLog: React.FC = () => {
  const {
    data: errorsData,
    isLoading,
    isError,
    refetch,
  } = useAdminQuickBooksErrors();

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  const errors = errorsData?.data || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Error Log</h3>
        <Button
          variant="ternary"
          onClick={() => refetch()}
          className="text-sm !px-3 !py-2"
        >
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading errors...</span>
        </div>
      ) : isError ? (
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Failed to load errors</p>
          <Button
            variant="primary"
            onClick={() => refetch()}
            className="text-sm"
          >
            Retry
          </Button>
        </div>
      ) : errors.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <p className="text-gray-500">No errors found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {errors.map((error, index) => (
            <div
              key={error.paymentId || index}
              className="border rounded-lg p-4 bg-white border-gray-200"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {error.userName}
                    </p>
                    {error.userEmail && (
                      <p className="text-xs text-gray-500">{error.userEmail}</p>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{error.error}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Payment ID: {error.paymentId}</span>
                  {error.quoteId && <span>Quote ID: {error.quoteId}</span>}
                  {error.amount && (
                    <span>Amount: ${error.amount.toFixed(2)}</span>
                  )}
                  <span>Created: {formatDate(error.createdAt)}</span>
                  {error.lastSyncAttempt && (
                    <span>
                      Last Attempt: {formatDate(error.lastSyncAttempt)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuickBooksErrorLog;
