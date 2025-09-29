import { Metadata } from "next";
import { routes } from "@/src/constants/routes";

export const metadata: Metadata = {
  title: routes.TEXT_RINGS.metaTitle,
  description: routes.TEXT_RINGS.description,
  openGraph: {
    title: routes.TEXT_RINGS.metaTitle,
    description: routes.TEXT_RINGS.description,
    url: routes.TEXT_RINGS.path,
  },
  alternates: {
    canonical: routes.TEXT_RINGS.path,
  },
};

export { default } from "@/src/containers/standard-builder/text-rings";
