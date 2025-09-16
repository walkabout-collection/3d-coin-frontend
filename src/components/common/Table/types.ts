import { SortOption } from "../SortDropdown/types";

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (value: T[keyof T], row: T, index: number) => React.ReactNode;
}

export interface TableProps<T extends { date?: string; order?: string }> {
  columns: TableColumn<T>[];
  data: T[];
  className?: string;
  alternatingRows?: boolean;
  showActions?: boolean;
  actions?: {
    label: string;
    onClick: (row: T) => void;
    icon?: string;
    variant?: 'primary' | 'secondary' | 'danger';
    show?: (row: T) => boolean;
  }[];
  pagination?: {
    currentPage: number;
    entriesPerPage: number;
    totalEntries: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  sortable?: boolean;
  sortOptions?: SortOption[];
  currentSort?: string;
  onSortChange?: (sort: string) => void;
  searchable?: boolean;
  onSearch?: (term: string) => void;
  searchPlaceholder?: string;
  loading?: boolean;
  emptyMessage?: string;
  headerClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
}

export interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}
