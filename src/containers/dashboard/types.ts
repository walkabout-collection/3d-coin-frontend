export interface SidebarItem {
  name: string;
  href: string;
  icon: string;
}

export interface DashboardCard {
  id: number;
  title: string;
  value: string | number;
  icon: string;
  bgColor?: string;
}

export interface UserProfilesLayoutProps {
  children: React.ReactNode;
}

export interface DashboardProps {
  cards?: DashboardCard[];
}