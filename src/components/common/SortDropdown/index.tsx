'use client';
import React, { useState, useMemo } from 'react';
import { SortDropdownProps } from './types';

const SortDropdown: React.FC<SortDropdownProps> = ({
  options = [
    { value: 'newest', label: 'Newest To Oldest' },
    { value: 'oldest', label: 'Oldest To Newest' },
    { value: 'order_asc', label: 'Order (Low to High)' },
    { value: 'order_desc', label: 'Order (High to Low)' },
  ],
  value: initialValue,
  onChange,
  data = [], 
  onSort, 
  className = '',
  placeholder = 'Select sort option',
  showLabel = true,
  labelText = 'Sort:',
}) => {
  const [internalSort, setInternalSort] = useState(initialValue || '');

  const sortedData = useMemo(() => {
    if (!internalSort || !data.length) return data;

    return [...data].sort((a, b) => {
      switch (internalSort) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'order_asc':
          return parseInt(b.order) - parseInt(a.order);
        case 'order_desc':
          return parseInt(b.order) - parseInt(a.order);
        default:
          return 0;
      }
    });
  }, [data, internalSort]);

  const handleSortChange = (sort: string) => {
    setInternalSort(sort);
    if (onChange) {
      onChange(sort);
    }
    if (onSort) {
      onSort(sortedData); 
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabel && (
        <span className="text-md text-primary font-semibold">{labelText}</span>
      )}
      <div className="relative">
        <select
          value={internalSort || ''}
          onChange={(e) => handleSortChange(e.target.value)}
          className="px-4 py-2 text-sm text-primary font-semibold bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none pr-8 min-w-[200px]"
        >
          {placeholder && !internalSort && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            className="text-gray-400"
          >
            <path
              d="M1 1.5L6 6.5L11 1.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SortDropdown;