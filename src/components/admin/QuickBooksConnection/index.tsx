"use client";
import React from "react";
import { useAdminQuickBooksConnections } from "@/src/hooks/useQueries";
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Button from "@/src/components/common/button/Button";

const QuickBooksConnection: React.FC = () => {
  const {
    data: connectionsData,
    isLoading,
    isError,
    refetch,
  } = useAdminQuickBooksConnections();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-10 w-10 animate-spin text-[#1a2a3a] mb-4" />
        <p className="text-gray-700 font-medium">Loading connections...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto bg-white border border-red-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Failed to Load Connections
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Unable to load QuickBooks connections. Please try again.
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

  const connections = connectionsData?.data || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          QuickBooks Connections
        </h3>
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

      {connections.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-700 font-medium">
            No QuickBooks connections found
          </p>
          <p className="text-sm text-gray-600 mt-2">
            No users have connected their QuickBooks accounts yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {connections.map((connection) => (
            <div
              key={connection.userId}
              className="border border-gray-200 rounded-xl p-6 bg-white hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {connection.isExpired ? (
                      <XCircle className="h-5 w-5 text-red-500" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {connection.userName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {connection.userEmail}
                      </p>
                    </div>
                  </div>

                  <div className="ml-8 space-y-2 mt-3">
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <span className="text-sm font-semibold text-gray-700">
                        Company ID:
                      </span>
                      <code className="text-xs font-mono text-gray-900 bg-white px-3 py-1 rounded border border-gray-200">
                        {connection.companyId}
                      </code>
                    </div>
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <span className="text-sm font-semibold text-gray-700">
                        Connected:
                      </span>
                      <span className="text-sm text-gray-900 font-medium">
                        {formatDate(connection.connectedAt)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <span className="text-sm font-semibold text-gray-700">
                        Recent Payments:
                      </span>
                      <span className="text-sm text-gray-900 font-semibold">
                        {connection.recentPayments}
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <span className="text-sm font-semibold text-gray-700">
                        Last Sync:
                      </span>
                      <span className="text-sm text-gray-900 font-medium">
                        {formatDate(connection.lastPaymentSync)}
                      </span>
                    </div>
                    {connection.expiresAt && (
                      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm font-semibold text-gray-700">
                          Expires:
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            connection.isExpired
                              ? "text-red-600"
                              : "text-gray-900"
                          }`}
                        >
                          {formatDate(connection.expiresAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="ml-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                      connection.isExpired
                        ? "bg-red-100 text-red-800 border-red-200"
                        : "bg-green-100 text-green-800 border-green-200"
                    }`}
                  >
                    {connection.isExpired ? (
                      <>
                        <XCircle className="h-3 w-3 mr-1" />
                        Expired
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuickBooksConnection;
