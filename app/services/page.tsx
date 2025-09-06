import { Metadata } from "next";
import { routes } from "@/src/constants/routes";

export const metadata: Metadata = {
  title: routes.SERVICES.metaTitle,
  description: routes.SERVICES.description,
  openGraph: {
    title: routes.SERVICES.metaTitle,
    description: routes.SERVICES.description,
    url: routes.SERVICES.path,
  },
  alternates: {
    canonical: routes.SERVICES.path,
  },
};

export { default } from "@/src/containers/services";
