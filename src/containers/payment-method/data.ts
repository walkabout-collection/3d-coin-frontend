import { PaymentOption } from "./types";

export const paymentOptions: PaymentOption[] = [
  {
    id: "quickbooks",
    name: "QuickBooks",
    logo: "/images/dashboard/quickbooks.svg",
  },
  {
    id: "stripe",
    name: "Stripe",
    logo: "/images/dashboard/stripe.svg",
  },
  {
    id: "manual",
    name: "Manual Invoice",
    logo: "/images/dashboard/email.svg",
  },
];
