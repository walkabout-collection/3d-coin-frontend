"use client";
import React from "react";
import { useAdminQuickBooksErrors } from "@/src/hooks/useQueries";
import { AlertCircle, CheckCircle, Loader2, RefreshCw } from "lucide-react";
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
          className="text-sm !px-4 !py-2 border border-gray-300 hover:bg-gray-50 transition-colors"
          disabled={isLoading}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-10 w-10 animate-spin text-[#1a2a3a] mb-4" />
          <p className="text-gray-700 font-medium">Loading errors...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto bg-white border border-red-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Failed to Load Errors
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Unable to load QuickBooks error log. Please try again.
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
      ) : errors.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-gray-900 font-semibold mb-1">No errors found</p>
          <p className="text-sm text-gray-700">
            All QuickBooks syncs are working correctly.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {errors.map((error, index) => (
            <div
              key={error.paymentId || index}
              className="border border-red-200 rounded-xl p-5 bg-gradient-to-br from-red-50 to-white hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">
                      {error.userName}
                    </p>
                    {error.userEmail && (
                      <p className="text-xs text-gray-700 font-medium">
                        {error.userEmail}
                      </p>
                    )}
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-red-100">
                  <p className="text-sm text-gray-900 font-medium">
                    {error.error}
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <span className="font-semibold text-gray-700">
                      Payment ID:
                    </span>
                    <p className="text-gray-900 font-mono mt-1">
                      {error.paymentId}
                    </p>
                  </div>
                  {error.quoteId && (
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <span className="font-semibold text-gray-700">
                        Quote ID:
                      </span>
                      <p className="text-gray-900 font-mono mt-1">
                        {error.quoteId}
                      </p>
                    </div>
                  )}
                  {error.amount && (
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <span className="font-semibold text-gray-700">
                        Amount:
                      </span>
                      <p className="text-gray-900 font-semibold mt-1">
                        ${error.amount.toFixed(2)}
                      </p>
                    </div>
                  )}
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <span className="font-semibold text-gray-700">
                      Created:
                    </span>
                    <p className="text-gray-900 mt-1">
                      {formatDate(error.createdAt)}
                    </p>
                  </div>
                  {error.lastSyncAttempt && (
                    <div className="bg-gray-50 p-2 rounded-lg md:col-span-2">
                      <span className="font-semibold text-gray-700">
                        Last Attempt:
                      </span>
                      <p className="text-gray-900 mt-1">
                        {formatDate(error.lastSyncAttempt)}
                      </p>
                    </div>
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
