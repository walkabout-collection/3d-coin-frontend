import { Order } from "./types";

export const ordersData: Order[] = [
  {
    id: 1,
    orderNumber: "ORD-001",
    customerName: "John Doe",
    date: "2025-09-10",
    status: "Pending",
    total: 150.00,
  },
  {
    id: 2,
    orderNumber: "ORD-002",
    customerName: "Jane Smith",
    date: "2025-09-09",
    status: "Processing",
    total: 200.50,
  },
  {
    id: 3,
    orderNumber: "ORD-003",
    customerName: "Alice Johnson",
    date: "2025-09-08",
    status: "Completed",
    total: 300.75,
  },
  {
    id: 4,
    orderNumber: "ORD-004",
    customerName: "Bob Brown",
    date: "2025-09-07",
    status: "Cancelled",
    total: 100.25,
  },
];