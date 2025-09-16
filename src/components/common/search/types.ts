export interface SearchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  placeholder?: string;
  onSearch?: (value: string) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  className?: string;
  inputSize?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
  bg?: string;
  rounded?: boolean;
  debounceDelay?: number;
  showSearchIcon?: boolean;
  iconPosition?: 'left' | 'right';
}