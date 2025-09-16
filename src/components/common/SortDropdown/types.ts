export interface SortOption {
  value: string;
  label: string;
}

export interface SortDropdownProps<T> {
  options?: SortOption[];
  value?: string;
  onChange?: (value: string) => void;
  data?: T[];
  onSort?: (sortedData: T[]) => void;
  className?: string;
  placeholder?: string;
  showLabel?: boolean;
  labelText?: string;
}
