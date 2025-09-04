import { Metadata } from "next";
import { routes } from "@/src/constants/routes";
export const metadata: Metadata = {
  title: routes.HOME.metaTitle,
  description: routes.HOME.description,
  openGraph: {
    title: routes.HOME.metaTitle,
    description: routes.HOME.description,
    url: routes.HOME.path,
  },
  alternates: {
    canonical: routes.HOME.path,
  },
};
export { default } from "@/src/containers/home";