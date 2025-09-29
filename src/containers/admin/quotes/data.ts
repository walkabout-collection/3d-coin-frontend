import { DashboardCard } from '../dashboard/types';
import { Quote } from './types';

export const quotesData: Quote[] = [
  {
    id: 1,
    name: 'CUSTOMER',
    orderNo: '#235678PO',
    email: 'CUSTOMEREMAIL@GMAIL.COM',
    label: '3D Builder Design',
    createdAt: '2025-09-15',
  },
  {
    id: 2,
    name: 'JOHN',
    orderNo: '#235678PO',
    email: 'CUSTOMEREMAIL@GMAIL.COM',
    label: '3D Builder Design',
    createdAt: '2025-09-14',
  },
  {
    id: 3,
    name: 'CUSTOMER',
    orderNo: '#235678PO',
    email: 'CUSTOMEREMAIL@GMAIL.COM',
    label: '3D Builder Design',
    createdAt: '2025-09-13',
  },
];


export const quotesCards: DashboardCard[] = [
 
  {
    id: 1,
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
 
];