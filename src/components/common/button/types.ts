export interface ButtonProps {
  type?: "button" | "submit" | "reset";
  width?: string;
  height?: string;
  variant?: "primary" | "secondary" | "ternary" | "outline";
  textColor?: string;
  bgColor?: string;
  borderColor?: string;
  fontWeight?: string;
  opacity?: number;
  padding?: string;
  radius?: string;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
  className?: string;
  shadow?: string;
  style?: React.CSSProperties;
  href?: string;
}