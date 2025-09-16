import { adminRoutes } from "@/src/constants/routes";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: adminRoutes.QUOTES.metaTitle,
  description: adminRoutes.QUOTES.description,
  openGraph: {
    title: adminRoutes.QUOTES.metaTitle,
    description: adminRoutes.QUOTES.description,
    url: adminRoutes.QUOTES.path,
  },
  alternates: {
    canonical: adminRoutes.QUOTES.path,
  },
};

export { default } from "@/src/containers/admin/quotes";
