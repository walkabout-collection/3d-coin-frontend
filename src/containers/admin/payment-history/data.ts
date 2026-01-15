import { PaymentDataItem } from "./types";

export const paymentData: PaymentDataItem[] = [
  {
    paymentMethod: "CREDIT CARD",
    orderId: "101",
    order: "#101",
    orderTotal: "$8.93",
    customer: "John Doe",
    customerEmail: "john@example.com",
    status: "PAID",
    date: "15/09/2025",
  },
  {
    paymentMethod: "PAYPAL",
    orderId: "102",
    order: "#102",
    orderTotal: "$11.43",
    customer: "Jane Smith",
    customerEmail: "jane@example.com",
    status: "PAID",
    date: "14/09/2025",
  },
  {
    paymentMethod: "CREDIT CARD",
    orderId: "104",
    order: "#104",
    orderTotal: "$14.29",
    customer: "Alex Brown",
    customerEmail: "alex@example.com",
    status: "REFUNDED",
    date: "12/09/2025",
  },
  {
    paymentMethod: "PAYPAL",
    orderId: "105",
    order: "#105",
    orderTotal: "$5.36",
    customer: "Chris Lee",
    customerEmail: "chris@example.com",
    status: "FAILED",
    date: "11/09/2025",
  },
];
