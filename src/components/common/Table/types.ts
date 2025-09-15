export interface TableColumn {
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (value: any, row: any, index: number) => React.ReactNode;
}

export interface TableAction {
  label: string;
  icon?: string;
  onClick: (row: any) => void;
  variant?: 'primary' | 'secondary' | 'danger';
  show?: (row: any) => boolean;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalEntries: number;
  entriesPerPage: number;
  onPageChange: (page: number) => void;
  showPrevious?: boolean;
  showNext?: boolean;
}

export interface SortOption {
  value: string;
  label: string;
}

export interface TableProps {
  columns: TableColumn[];
  data: any[];
  className?: string;
  alternatingRows?: boolean;
  showActions?: boolean;
  actions?: TableAction[];
  pagination?: PaginationProps;
  sortable?: boolean; 
  sortOptions?: SortOption[];
  currentSort?: string;
  onSortChange?: (sort: string) => void;
  searchable?: boolean;
  onSearch?: (searchTerm: string) => void;
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