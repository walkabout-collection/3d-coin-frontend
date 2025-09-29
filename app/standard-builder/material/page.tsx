import { Metadata } from "next";
import { routes } from "@/src/constants/routes";

export const metadata: Metadata = {
  title: routes.MATERIAL.metaTitle,
  description: routes.MATERIAL.description,
  openGraph: {
    title: routes.MATERIAL.metaTitle,
    description: routes.MATERIAL.description,
    url: routes.MATERIAL.path,
  },
  alternates: {
    canonical: routes.MATERIAL.path,
  },
};

export { default } from "@/src/containers/standard-builder/material";
