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
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-[#1a2a3a] rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Payment Methods
              </h1>
              <p className="text-gray-700 mt-1">
                Monitor and manage QuickBooks integrations across all users
              </p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {errors.length > 0 && (
          <div className="mb-6 bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-red-900">
                QuickBooks Sync Errors ({errors.length})
              </h3>
            </div>
            <div className="space-y-2 bg-white rounded-lg p-4 border border-red-200">
              {errors.slice(0, 5).map((error, index) => (
                <div
                  key={error.paymentId || index}
                  className="text-sm py-2 border-b border-red-100 last:border-0"
                >
                  <span className="font-semibold text-gray-900">
                    {error.userName}:
                  </span>{" "}
                  <span className="text-gray-700">{error.error}</span> -
                  <span className="text-gray-600 font-mono ml-1">
                    Payment ID: {error.paymentId}
                  </span>
                </div>
              ))}
              {errors.length > 5 && (
                <div className="text-sm font-semibold text-gray-700 pt-2">
                  ...and {errors.length - 5} more error
                  {errors.length - 5 !== 1 ? "s" : ""}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <nav className="flex space-x-1 p-2" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200
                    ${
                      activeTab === tab.id
                        ? "bg-[#1a2a3a] text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                  {tab.id === "errors" && errors.length > 0 && (
                    <span
                      className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                        activeTab === tab.id
                          ? "bg-red-500 text-white"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {errors.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {tabs.find((tab) => tab.id === activeTab)?.component}
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentMethod;
