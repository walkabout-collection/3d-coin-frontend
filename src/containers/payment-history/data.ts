import { PaymentDataItem } from "./types";

/**
 * @deprecated This mock data is no longer used.
 * The payment history now fetches data from the API.
 * This file is kept for reference only.
 */
export const paymentData: PaymentDataItem[] = [
  {
    paymentMethod: "CREDIT CARD",
    order: "101",
    total: "$8.93",
    date: "15/09/2025",
  },
  {
    paymentMethod: "PAYPAL",
    order: "102",
    total: "$11.43",
    date: "14/09/2025",
  },
  {
    paymentMethod: "CREDIT CARD",
    order: "104",
    total: "$14.29",
    date: "12/09/2025",
  },
  {
    paymentMethod: "PAYPAL",
    order: "105",
    total: "$5.36",
    date: "11/09/2025",
  },
];
