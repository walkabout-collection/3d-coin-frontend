import { Metadata } from "next";
import { routes } from "@/src/constants/routes";

export const metadata: Metadata = {
  title: routes.PAYMENT_HISTORY.metaTitle,
  description: routes.PAYMENT_HISTORY.description,
  openGraph: {
    title: routes.PAYMENT_HISTORY.metaTitle,
    description: routes.PAYMENT_HISTORY.description,
    url: routes.PAYMENT_HISTORY.path,
  },
  alternates: {
    canonical: routes.PAYMENT_HISTORY.path,
  },
};

export { default } from "@/src/containers/payment-history";
