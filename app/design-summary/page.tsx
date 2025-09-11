import { Metadata } from "next";
import { routes } from "@/src/constants/routes";

export const metadata: Metadata = {
  title: routes.DESIGN_SUMMARY.metaTitle,
  description: routes.DESIGN_SUMMARY.description,
  openGraph: {
    title: routes.DESIGN_SUMMARY.metaTitle,
    description: routes.DESIGN_SUMMARY.description,
    url: routes.DESIGN_SUMMARY.path,
  },
  alternates: {
    canonical: routes.DESIGN_SUMMARY.path,
  },
};

export { default } from "@/src/containers/design-summary";
