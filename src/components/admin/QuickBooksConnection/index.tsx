"use client";
import React from "react";
import { useAdminQuickBooksConnections } from "@/src/hooks/useQueries";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";
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
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading connections...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">
          Failed to load QuickBooks connections
        </p>
        <Button variant="primary" onClick={() => refetch()} className="text-sm">
          Retry
        </Button>
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
          className="text-sm !px-3 !py-2"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {connections.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No QuickBooks connections found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {connections.map((connection) => (
            <div
              key={connection.userId}
              className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
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

                  <div className="ml-8 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">
                        Company ID:
                      </span>
                      <code className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {connection.companyId}
                      </code>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">
                        Connected:
                      </span>
                      <span className="text-sm text-gray-600">
                        {formatDate(connection.connectedAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">
                        Recent Payments:
                      </span>
                      <span className="text-sm text-gray-600">
                        {connection.recentPayments}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">
                        Last Sync:
                      </span>
                      <span className="text-sm text-gray-600">
                        {formatDate(connection.lastPaymentSync)}
                      </span>
                    </div>
                    {connection.expiresAt && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">
                          Expires:
                        </span>
                        <span className="text-sm text-gray-600">
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
