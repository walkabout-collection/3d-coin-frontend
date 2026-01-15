"use client";
import { useState } from "react";
import QuickBooksConnection from "@/src/components/admin/QuickBooksConnection";
import QuickBooksSync from "@/src/components/admin/QuickBooksSync";
import QuickBooksTransactionMapping from "@/src/components/admin/QuickBooksTransactionMapping";
import QuickBooksErrorLog from "@/src/components/admin/QuickBooksErrorLog";
import { useAdminQuickBooksErrors } from "@/src/hooks/useQueries";
import { Users, RefreshCw, Link2, AlertCircle } from "lucide-react";

type TabType = "connections" | "sync" | "transactions" | "errors";

const AdminPaymentMethod: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("connections");
  const { data: errorsData } = useAdminQuickBooksErrors();
  const errors = errorsData?.data || [];

  const tabs = [
    {
      id: "connections" as TabType,
      label: "Connections",
      icon: Users,
      component: <QuickBooksConnection />,
    },
    {
      id: "sync" as TabType,
      label: "Sync Status",
      icon: RefreshCw,
      component: <QuickBooksSync />,
    },
    {
      id: "transactions" as TabType,
      label: "Transactions",
      icon: Link2,
      component: <QuickBooksTransactionMapping />,
    },
    {
      id: "errors" as TabType,
      label: "Error Log",
      icon: AlertCircle,
      component: <QuickBooksErrorLog />,
    },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Admin Payment Methods
        </h1>
        <p className="text-gray-600">
          Monitor and manage QuickBooks integrations across all users
        </p>
      </div>

      {/* Error Alert */}
      {errors.length > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <h3 className="text-lg font-semibold text-red-800">
              QuickBooks Sync Errors ({errors.length})
            </h3>
          </div>
          <div className="space-y-2">
            {errors.slice(0, 5).map((error, index) => (
              <div key={error.paymentId || index} className="text-sm">
                <span className="font-medium">{error.userName}:</span>{" "}
                {error.error} - Payment ID: {error.paymentId}
              </div>
            ))}
            {errors.length > 5 && (
              <div className="text-sm text-gray-600">
                ...and {errors.length - 5} more errors
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {tabs.find((tab) => tab.id === activeTab)?.component}
      </div>
    </div>
  );
};

export default AdminPaymentMethod;
