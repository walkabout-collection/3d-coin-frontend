import { PaymentOption } from "@/src/containers/payment-method/types";

export const paymentOptions: PaymentOption[] = [
  {
    id: "quickbooks",
    name: " Quickbooks",
    logo: "/images/home/quickbooks.png",
  },
  {
    id: "stripe",
    name: " Stripe",
    logo: "/images/home/stripe.png",
  },
  {
    id: "manual",
    name: "Manual Invoice",
    logo: "/images/dashboard/email.svg",
  },
];
