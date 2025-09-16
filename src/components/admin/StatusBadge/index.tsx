import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Clock, X } from 'lucide-react';

export interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
  editable?: boolean;
  onStatusChange?: (newStatus: string) => void;
  userId?: string | number;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  variant = 'default', 
  className = '',
  editable = false,
  onStatusChange,
  userId
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const statusOptions = [
    { 
      value: 'approved', 
      label: 'Approved', 
      icon: <Check size={14} />,
      styles: 'bg-green-100 text-green-800 border border-green-200 hover:bg-green-200'
    },
    { 
      value: 'pending', 
      label: 'Pending', 
      icon: <Clock size={14} />,
      styles: 'bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200'
    },
    { 
      value: 'cancel', 
      label: 'Cancel', 
      icon: <X size={14} />,
      styles: 'bg-red-100 text-red-800 border border-red-200 hover:bg-red-200'
    }
  ];

  const getVariantStyles = () => {
    const lowercaseStatus = currentStatus.toLowerCase();
    
    if (variant === 'default') {
      if (lowercaseStatus.includes('approved') || lowercaseStatus.includes('success')) {
        return 'bg-green-100 text-green-800 border border-green-200';
      }
      if (lowercaseStatus.includes('pending') || lowercaseStatus.includes('waiting')) {
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      }
      if (lowercaseStatus.includes('cancel') || lowercaseStatus.includes('rejected') || lowercaseStatus.includes('failed')) {
        return 'bg-red-100 text-red-800 border border-red-200';
      }
     
      return 'bg-gray-100 text-gray-800 border border-gray-200';
    }

    const variants = {
      default: 'bg-gray-100 text-gray-800 border border-gray-200',
      success: 'bg-green-100 text-green-800 border border-green-200',
      warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      danger: 'bg-red-100 text-red-800 border border-red-200',
      info: 'bg-blue-100 text-blue-800 border border-blue-200',
    };
    return variants[variant];
  };

  const getCurrentStatusIcon = () => {
    const lowercaseStatus = currentStatus.toLowerCase();
    if (lowercaseStatus.includes('approved')) return <Check size={14} />;
    if (lowercaseStatus.includes('pending')) return <Clock size={14} />;
    if (lowercaseStatus.includes('cancel')) return <X size={14} />;
    return null;
  };

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus);
    setIsOpen(false);
    
    if (onStatusChange) {
      onStatusChange(newStatus);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!editable) {
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${getVariantStyles()} ${className}`}>
        {getCurrentStatusIcon()}
        {currentStatus}
      </span>
    );
  }

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1 px-2 py-1 w-28 rounded-lg text-xs font-medium uppercase tracking-wide cursor-pointer hover:shadow-md transition-all duration-200 ${getVariantStyles()} ${className}`}
      >
        {getCurrentStatusIcon()}
        {currentStatus}
        <ChevronDown 
          size={12} 
          className={` transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-32 bg-gray-100 border border-gray-200 rounded-md shadow-lg z-50">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center gap-2 transition-colors duration-150 first:rounded-t-md last:rounded-b-md ${
                currentStatus.toLowerCase() === option.value 
                  ? option.styles.replace('hover:', '') 
                  : `hover:${option.styles.split(' ').find(cls => cls.startsWith('hover:'))?.replace('hover:', 'bg-')} text-gray-700 hover:text-gray-900`
              }`}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusBadge;