import { PaymentOption } from "@/src/containers/payment-method/types";

export const paymentOptions: PaymentOption[] = [
  // {
  //   id: "QUICKBOOKS",
  //   name: "QuickBooks",
  //   logo: "/images/dashboard/quickbooks.svg",
  // },
  {
    id: "STRIPE",
    name: "Stripe",
    logo: "/images/home/stripe.png",
  },
  {
    id: "MANUAL",
    name: "Manual",
    logo: "/images/dashboard/email.svg",
  },
];
