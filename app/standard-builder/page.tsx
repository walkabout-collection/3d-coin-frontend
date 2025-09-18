import { Metadata } from "next";
import { routes } from "@/src/constants/routes";

export const metadata: Metadata = {
  title: routes.STANDARD.metaTitle,
  description: routes.STANDARD.description,
  openGraph: {
    title: routes.STANDARD.metaTitle,
    description: routes.STANDARD.description,
    url: routes.STANDARD.path,
  },
  alternates: {
    canonical: routes.STANDARD.path,
  },
};

export { default } from "@/src/containers/standard-builder/dimensions";
