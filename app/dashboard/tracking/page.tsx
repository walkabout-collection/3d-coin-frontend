import { Metadata } from "next";
import { routes } from "@/src/constants/routes";

export const metadata: Metadata = {
  title: routes.TRACKING.metaTitle,
  description: routes.TRACKING.description,
  openGraph: {
    title: routes.TRACKING.metaTitle,
    description: routes.TRACKING.description,
    url: routes.TRACKING.path,
  },
  alternates: {
    canonical: routes.TRACKING.path,
  },
};

export { default } from "@/src/containers/tracking";
