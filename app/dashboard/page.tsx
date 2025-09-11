import { Metadata } from "next";
import { routes } from "@/src/constants/routes";

export const metadata: Metadata = {
  title: routes.DASHBOARD.metaTitle,
  description: routes.DASHBOARD.description,
  openGraph: {
    title: routes.DASHBOARD.metaTitle,
    description: routes.DASHBOARD.description,
    url: routes.DASHBOARD.path,
  },
  alternates: {
    canonical: routes.DASHBOARD.path,
  },
};

export { default } from "@/src/containers/dashboard";
