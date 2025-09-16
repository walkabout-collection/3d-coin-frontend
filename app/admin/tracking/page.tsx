import { adminRoutes } from "@/src/constants/routes";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: adminRoutes.TRACKING.metaTitle,
  description: adminRoutes.TRACKING.description,
  openGraph: {
    title: adminRoutes.TRACKING.metaTitle,
    description: adminRoutes.TRACKING.description,
    url: adminRoutes.TRACKING.path,
  },
  alternates: {
    canonical: adminRoutes.TRACKING.path,
  },
};

export { default } from "@/src/containers/admin/tracking";
