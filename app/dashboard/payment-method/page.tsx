import { Metadata } from "next";
import { routes } from "@/src/constants/routes";

export const metadata: Metadata = {
  title: routes.PAYMENT_METHOD.metaTitle,
  description: routes.PAYMENT_METHOD.description,
  openGraph: {
    title: routes.PAYMENT_METHOD.metaTitle,
    description: routes.PAYMENT_METHOD.description,
    url: routes.PAYMENT_METHOD.path,
  },
  alternates: {
    canonical: routes.PAYMENT_METHOD.path,
  },
};

export { default } from "@/src/containers/payment-method";
