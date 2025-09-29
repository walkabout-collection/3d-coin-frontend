import { Metadata } from "next";
import { routes } from "@/src/constants/routes";

export const metadata: Metadata = {
  title: routes.CONFIRM_PACKAGING.metaTitle,
  description: routes.CONFIRM_PACKAGING.description,
  openGraph: {
    title: routes.CONFIRM_PACKAGING.metaTitle,
    description: routes.CONFIRM_PACKAGING.description,
    url: routes.CONFIRM_PACKAGING.path,
  },
  alternates: {
    canonical: routes.CONFIRM_PACKAGING.path,
  },
};

export { default } from "@/src/containers/standard-builder/confirm-packaging";
