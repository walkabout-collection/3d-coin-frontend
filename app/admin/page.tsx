import { adminRoutes } from "@/src/constants/routes";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: adminRoutes.DASHBOARD.metaTitle,
  description: adminRoutes.DASHBOARD.description,
  openGraph: {
    title: adminRoutes.DASHBOARD.metaTitle,
    description: adminRoutes.DASHBOARD.description,
    url: adminRoutes.DASHBOARD.path,
  },
  alternates: {
    canonical: adminRoutes.DASHBOARD.path,
  },
};

export { default } from "@/src/containers/admin/dashboard";
