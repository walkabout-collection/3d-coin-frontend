import { Metadata } from "next";
import { routes } from "@/src/constants/routes";

export const metadata: Metadata = {
  title: routes.CUSTOM_SHAPES.metaTitle,
  description: routes.CUSTOM_SHAPES.description,
  openGraph: {
    title: routes.CUSTOM_SHAPES.metaTitle,
    description: routes.CUSTOM_SHAPES.description,
    url: routes.CUSTOM_SHAPES.path,
  },
  alternates: {
    canonical: routes.CUSTOM_SHAPES.path,
  },
};

export { default } from "@/src/containers/custom-shapes";
