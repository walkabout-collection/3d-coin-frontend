import { adminRoutes } from "@/src/constants/routes";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: adminRoutes.ORDERS.metaTitle,
  description: adminRoutes.ORDERS.description,
  openGraph: {
    title: adminRoutes.ORDERS.metaTitle,
    description: adminRoutes.ORDERS.description,
    url: adminRoutes.ORDERS.path,
  },
  alternates: {
    canonical: adminRoutes.ORDERS.path,
  },
};

export { default } from "@/src/containers/admin/order-history";
