import { adminRoutes } from "@/src/constants/routes";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: adminRoutes.PAYMENT_HISTORY.metaTitle,
  description: adminRoutes.PAYMENT_HISTORY.description,
  openGraph: {
    title: adminRoutes.PAYMENT_HISTORY.metaTitle,
    description: adminRoutes.PAYMENT_HISTORY.description,
    url: adminRoutes.PAYMENT_HISTORY.path,
  },
  alternates: {
    canonical: adminRoutes.PAYMENT_HISTORY.path,
  },
};

export { default } from "@/src/containers/admin/payment-history";
