import React from 'react';
import { StatusBadgeProps } from '../Table/types';

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  variant = 'default', 
  className = '' 
}) => {
  const getVariantStyles = () => {
    const lowercaseStatus = status.toLowerCase();
    
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
      if (lowercaseStatus.includes('warning') || lowercaseStatus.includes('hold')) {
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
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

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${getVariantStyles()} ${className}`}>
      {status}
    </span>
  );
};

export default StatusBadge;