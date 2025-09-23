import { Metadata } from "next";
import { routes } from "@/src/constants/routes";

export const metadata: Metadata = {
  title: routes.ARTWORK.metaTitle,
  description: routes.ARTWORK.description,
  openGraph: {
    title: routes.ARTWORK.metaTitle,
    description: routes.ARTWORK.description,
    url: routes.ARTWORK.path,
  },
  alternates: {
    canonical: routes.ARTWORK.path,
  },
};

export { default } from "@/src/containers/standard-builder/art-work";
