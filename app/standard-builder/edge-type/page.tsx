import { Metadata } from "next";
import { routes } from "@/src/constants/routes";

export const metadata: Metadata = {
  title: routes.EDGE_TYPE.metaTitle,
  description: routes.EDGE_TYPE.description,
  openGraph: {
    title: routes.EDGE_TYPE.metaTitle,
    description: routes.EDGE_TYPE.description,
    url: routes.EDGE_TYPE.path,
  },
  alternates: {
    canonical: routes.EDGE_TYPE.path,
  },
};

export { default } from "@/src/containers/standard-builder/edge-type";
