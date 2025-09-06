export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface NavbarProps {
  transparent?: boolean;
  className?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}