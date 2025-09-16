import { SidebarItem, DashboardCard } from './types';

export const sidebarItems: SidebarItem[] = [
  { 
    name: "Dashboard", 
    href: "/admin", 
    icon: "/images/dashboard/dashboard.svg" 
  },
  { 
    name: "Orders", 
    href: "/admin/orders", 
    icon: "/images/dashboard/orders.svg" 
  },
  { 
    name: "Quotes", 
    href: "/admin/quotes", 
    icon: "/images/dashboard/quotes.svg" 
  },
  { 
    name: "Tracking", 
    href: "/admin/tracking", 
    icon: "/images/dashboard/tracking.svg" 
  },
  { 
    name: "Payment Method", 
    href: "/admin/payment-method", 
    icon: "/images/dashboard/payment-method.svg" 
  },
  { 
    name: "Payment History", 
    href: "/admin/payment-history", 
    icon: "/images/dashboard/payment-history.svg" 
  },
  { 
    name: "Account Setting", 
    href: "/admin/account-setting", 
    icon: "/images/dashboard/account-setting.svg" 
  },
  { 
    name: "Log Out", 
    href: "/logout", 
    icon: "/images/dashboard/log-out.svg" 
  },
];

export const dashboardCards: DashboardCard[] = [
  {
    id: 1,
    title: "Lifetime Orders",
    value: 100,
    icon: "/images/dashboard/lifetime-orders.svg",
    bgColor: "#f4f6fa"
  },
  {
    id: 2,
    title: "Pending Quotes",
    value: 25,
    icon: "/images/dashboard/pending-quotes.svg",
    bgColor: "#f4f6fa"
  },
  {
    id: 3,
    title: "Approve Quotes",
    value: 25,
    icon: "/images/dashboard/approve-quotes.svg",
    bgColor: "#f4f6fa"
  },
  {
    id: 4,
    title: "Payment",
    value: 25,
    icon: "/images/dashboard/payment.svg",
    bgColor: "#f4f6fa"
  }
];