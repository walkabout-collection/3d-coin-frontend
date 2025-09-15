export interface SortOption {
  value: string;
  label: string;
}

export interface SortDropdownProps {
  options?: SortOption[];
  value?: string;
  onChange?: (value: string) => void;
  data?: any[]; 
  onSort?: (sortedData: any[]) => void; 
  className?: string;
  placeholder?: string;
  showLabel?: boolean;
  labelText?: string;
}