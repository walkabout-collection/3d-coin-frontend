import { Metadata } from "next";
import { routes } from "@/src/constants/routes";

export const metadata: Metadata = {
  title: routes.PACKAGING.metaTitle,
  description: routes.PACKAGING.description,
  openGraph: {
    title: routes.PACKAGING.metaTitle,
    description: routes.PACKAGING.description,
    url: routes.PACKAGING.path,
  },
  alternates: {
    canonical: routes.PACKAGING.path,
  },
};

export { default } from "@/src/containers/standard-builder/packaging";
