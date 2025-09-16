import { adminRoutes } from "@/src/constants/routes";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: adminRoutes.PAYMENT_METHOD.metaTitle,
  description: adminRoutes.PAYMENT_METHOD.description,
  openGraph: {
    title: adminRoutes.PAYMENT_METHOD.metaTitle,
    description: adminRoutes.PAYMENT_METHOD.description,
    url: adminRoutes.PAYMENT_METHOD.path,
  },
  alternates: {
    canonical: adminRoutes.PAYMENT_METHOD.path,
  },
};

export { default } from "@/src/containers/admin/payment-method";
