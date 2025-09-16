'use client';
import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { TableProps, TableColumn } from './types';
import Search from '../search';
import StatusBadge from '../StatusBadge';
import SortDropdown from '../SortDropdown';

function Table<T extends { date?: string; order?: string }>({
  columns,
  data,
  className = '',
  alternatingRows = true,
  showActions = false,
  actions = [],
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
}: TableProps<T>) {
  const [internalSort, setInternalSort] = useState(currentSort || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortedDataState, setSortedDataState] = useState<T[]>(data);

  const filteredData = useMemo(() => {
    if (!searchTerm) return sortedDataState;

    return sortedDataState.filter((row) =>
      Object.values(row as object).some((value) =>
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

  const handleSortData = (sortedData: T[]) => {
    setSortedDataState(sortedData);
  };

  const renderCellContent = (
    column: TableColumn<T>,
    value: T[keyof T],
    row: T,
    index: number
  ) => {
    if (column.render) {
      return column.render(value, row, index);
    }

    if (String(column.key).toLowerCase().includes('status')) {
      return <StatusBadge status={String(value)} />;
    }

    if (String(column.key).toLowerCase().includes('packaging')) {
      return <span className="text-sm">{String(value)}</span>;
    }

    return value as React.ReactNode;
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
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b border-gray-200 ${headerClassName}`}>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider ${
                    column.width || ''
                  }`}
                  style={{ textAlign: column.align || 'left' }}
                >
                  {column.label}
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
                  Loading...
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
                    alternatingRows && index % 2 === 1
                      ? 'bg-gray-100'
                      : 'bg-white'
                  } ${rowClassName}`}
                >
                  {columns.map((column) => (
                    <td
                      key={`${index}-${String(column.key)}`}
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
                              className="px-3 py-1 text-xs font-medium rounded-md"
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
    </div>
  );
}

export default Table;