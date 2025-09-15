'use client';
import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { TableProps } from './types';
import Search from '../search';
import StatusBadge from '../StatusBadge';
import SortDropdown from '../SortDropdown';

const Table: React.FC<TableProps> = ({
  columns,
  data,
  className = '',
  alternatingRows = true,
  showActions = false,
  actions = [],
  pagination,
  sortable = false,
  sortOptions = [
    { value: 'newest', label: 'Newest To Oldest' },
    { value: 'oldest', label: 'Oldest To Newest' },
    { value: 'order_asc', label: 'Order (Low to High)' },
    { value: 'order_desc', label: 'Order (High to Low)' },
  ],
  currentSort,
  onSortChange,
  searchable = false,
  onSearch,
  searchPlaceholder = 'Search...',
  loading = false,
  emptyMessage = 'No data available',
  headerClassName = '',
  rowClassName = '',
  cellClassName = '',
}) => {
  const [internalSort, setInternalSort] = useState(currentSort || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortedDataState, setSortedDataState] = useState(data); 

  const filteredData = useMemo(() => {
    if (!searchTerm) return sortedDataState;

    return sortedDataState.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [sortedDataState, searchTerm]);

  const handleSortChange = (sort: string) => {
    setInternalSort(sort);
    if (onSortChange) {
      onSortChange(sort);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (onSearch) {
      onSearch(term);
    }
  };

  const handleSortData = (sortedData: any[]) => {
    setSortedDataState(sortedData); 
  };

  const renderCellContent = (column: any, value: any, row: any, index: number) => {
    if (column.render) {
      return column.render(value, row, index);
    }

    if (column.key.toLowerCase().includes('status')) {
      return <StatusBadge status={value} />;
    }

    if (column.key.toLowerCase().includes('packaging')) {
      return <span className="text-sm">{value}</span>;
    }

    return value;
  };

  return (
    <div className={`w-full min-h-screen ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {searchable && (
            <Search
              placeholder={searchPlaceholder}
              onSearch={handleSearch}
              variant="primary"
            />
          )}
        </div>

        <div className="flex items-center gap-4">
          {sortable && sortOptions.length > 0 && (
            <SortDropdown
              options={sortOptions}
              value={internalSort}
              onChange={handleSortChange}
              data={data} 
              onSort={handleSortData} 
              showLabel={true}
              labelText="Sort:"
            />
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b border-gray-200 ${headerClassName}`}>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider ${
                    column.width || ''
                  }`}
                  style={{ textAlign: column.align || 'left' }}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="text-gray-400"
                      >
                        <path d="M8 2L11 6H5L8 2ZM8 14L5 10H11L8 14Z" fill="currentColor" />
                      </svg>
                    )}
                  </div>
                </th>
              ))}
              {showActions && actions.length > 0 && (
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (showActions ? 1 : 0)}
                  className="px-6 py-8 text-center"
                >
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="ml-2 text-gray-500">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (showActions ? 1 : 0)}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              filteredData.map((row, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    alternatingRows && index % 2 === 1 ? 'bg-gray-100' : 'bg-white'
                  } ${rowClassName}`}
                >
                  {columns.map((column) => (
                    <td
                      key={`${index}-${column.key}`}
                      className={`px-6 py-4 text-sm text-gray-900 ${cellClassName}`}
                      style={{ textAlign: column.align || 'left' }}
                    >
                      {renderCellContent(column, row[column.key], row, index)}
                    </td>
                  ))}
                  {showActions && actions.length > 0 && (
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {actions.map((action, actionIndex) => {
                          if (action.show && !action.show(row)) return null;

                          return (
                            <button
                              key={actionIndex}
                              onClick={() => action.onClick(row)}
                              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                                action.variant === 'danger'
                                  ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                  : action.variant === 'secondary'
                                  ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                              }`}
                            >
                              {action.icon && (
                                <Image
                                  src={action.icon}
                                  alt=""
                                  width={14}
                                  height={14}
                                  className="inline mr-1"
                                />
                              )}
                              {action.label}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between mt-6 pt-4 mb-10">
          <div className="text-sm text-gray-500">
            Showing {((pagination.currentPage - 1) * pagination.entriesPerPage) + 1} to {Math.min(pagination.currentPage * pagination.entriesPerPage, pagination.totalEntries)} of {pagination.totalEntries} entries
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const pageNumber = i + 1;
              const isActive = pageNumber === pagination.currentPage;

              return (
                <button
                  key={pageNumber}
                  onClick={() => pagination.onPageChange(pageNumber)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
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