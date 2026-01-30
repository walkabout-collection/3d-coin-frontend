"use client";
import React, { useState, useEffect } from "react";
import { TransactionFilters } from "@/src/services/apiServices";
import { X } from "lucide-react";
import Button from "@/src/components/common/button/Button";

interface TransactionFiltersProps {
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
}

const TransactionFiltersComponent: React.FC<TransactionFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const [localFilters, setLocalFilters] = useState<TransactionFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (
    key: keyof TransactionFilters,
    value: string | undefined,
  ) => {
    const newFilters = { ...localFilters, [key]: value || undefined, page: 1 };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const cleared = { page: 1, limit: 50 };
    setLocalFilters(cleared);
    onFiltersChange(cleared);
  };

  const hasActiveFilters =
    localFilters.method ||
    localFilters.status ||
    localFilters.startDate ||
    localFilters.endDate ||
    localFilters.search;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ternary"
            onClick={clearFilters}
            className="!px-3 !py-1 text-xs"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Method Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          <select
            value={localFilters.method || ""}
            onChange={(e) =>
              handleChange("method", e.target.value || undefined)
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a3a] focus:border-transparent"
          >
            <option value="">All Methods</option>
            <option value="QUICKBOOKS">QuickBooks</option>
            <option value="STRIPE">Stripe</option>
            <option value="MANUAL">Manual</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={localFilters.status || ""}
            onChange={(e) =>
              handleChange("status", e.target.value || undefined)
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a3a] focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="SUCCESS">Success</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={localFilters.startDate || ""}
            onChange={(e) => handleChange("startDate", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a3a] focus:border-transparent"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <input
            type="date"
            value={localFilters.endDate || ""}
            onChange={(e) => handleChange("endDate", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a3a] focus:border-transparent"
          />
        </div>
      </div>

      {/* Search */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search
        </label>
        <input
          type="text"
          placeholder="Search by customer email, name, or payment ID..."
          value={localFilters.search || ""}
          onChange={(e) => handleChange("search", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a3a] focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default TransactionFiltersComponent;
