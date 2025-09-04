import { Metadata } from "next";
import { routes } from "@/src/constants/routes";
export const metadata: Metadata = {
  title: routes.LOGIN.metaTitle,
  description: routes.LOGIN.description,
  openGraph: {
    title: routes.LOGIN.metaTitle,
    description: routes.LOGIN.description,
    url: routes.LOGIN.path,
  },
  alternates: {
    canonical: routes.LOGIN.path,
  },
};
export { default } from "@/src/containers/login";

