import { Metadata } from "next";
import { routes } from "@/src/constants/routes";

export const metadata: Metadata = {
  title: routes.PRICING.metaTitle,
  description: routes.PRICING.description,
  openGraph: {
    title: routes.PRICING.metaTitle,
    description: routes.PRICING.description,
    url: routes.PRICING.path,
  },
  alternates: {
    canonical: routes.PRICING.path,
  },
};

export { default } from "@/src/containers/pricing";
