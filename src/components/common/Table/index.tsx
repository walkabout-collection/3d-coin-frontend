import React from "react";
import { TableColumn } from "./types";

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  actions?: {
    label: string;
    onClick?: (row: T) => void;
    variant?: "primary" | "secondary" | "danger" | "success";
    show?: (row: T) => boolean;
  }[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  entriesPerPage?: number;
  totalEntries?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Table = <T extends Record<string, any>>({
  columns,
  data,
  actions,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  entriesPerPage = 10,
  totalEntries = 0,
  hasNextPage = false,
  hasPreviousPage = false,
}: TableProps<T>) => {
  const getVariantClasses = (
    variant?: "primary" | "secondary" | "danger" | "success",
  ) => {
    switch (variant) {
      case "primary":
        return "bg-[#1a2a3a] text-white";
      case "secondary":
        return "bg-gray-200 text-gray-800 hover:bg-gray-300";
      case "danger":
        return "bg-red-600 text-white hover:bg-red-700";
      case "success":
        return "text-green-600 font-bold text-lg";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    const pageNumbers: number[] = [];

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const startEntry = (currentPage - 1) * entriesPerPage + 1;
  const endEntry = Math.min(currentPage * entriesPerPage, totalEntries);

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider ${
                    column.width || ""
                  }`}
                >
                  {column.label}
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  index % 2 === 1 ? "bg-gray-100" : "bg-white"
                }`}
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className="px-6 py-4 text-sm text-gray-900"
                  >
                    {column.render
                      ? column.render(
                          column.key in row
                            ? (row[column.key as keyof T] as T[keyof T])
                            : undefined,
                          row,
                          index,
                        )
                      : column.key in row
                        ? (row[column.key as keyof T] as React.ReactNode)
                        : null}
                  </td>
                ))}
                {actions && actions.length > 0 && (
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {actions.map((action, actionIndex) => {
                        const shouldShow = action.show
                          ? action.show(row)
                          : true;
                        if (!shouldShow) return null;

                        return (
                          <button
                            key={actionIndex}
                            onClick={() =>
                              action.onClick && action.onClick(row)
                            }
                            className={`max-w-lg rounded-full py-2 px-6 font-base text-sm ${getVariantClasses(
                              action.variant,
                            )} ${!action.onClick ? "cursor-default" : ""}`}
                            disabled={!action.onClick}
                          >
                            {action.label}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {onPageChange && totalPages > 1 && totalEntries > 10 && (
        <div className="flex items-center justify-between mt-6 pt-4 mb-10">
          <div className="text-sm text-gray-500">
            Showing {startEntry} to {endEntry} of {totalEntries} entries
          </div>

          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={!hasPreviousPage}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  pageNumber === currentPage
                    ? "bg-[#1a2a3a] text-white"
                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {pageNumber}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!hasNextPage}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
