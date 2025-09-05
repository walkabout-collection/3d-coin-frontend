import { Metadata } from "next";
import { routes } from "@/src/constants/routes";

export const metadata: Metadata = {
  title: routes.ABOUT_US.metaTitle,
  description: routes.ABOUT_US.description,
  openGraph: {
    title: routes.ABOUT_US.metaTitle,
    description: routes.ABOUT_US.description,
    url: routes.ABOUT_US.path,
  },
  alternates: {
    canonical: routes.ABOUT_US.path,
  },
};

export { default } from "@/src/containers/about-us";
