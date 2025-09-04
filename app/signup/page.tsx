import { Metadata } from "next";
import { routes } from "@/src/constants/routes";

export const metadata: Metadata = {
  title: routes.SIGNUP.metaTitle,
  description: routes.SIGNUP.description,
  openGraph: {
    title: routes.SIGNUP.metaTitle,
    description: routes.SIGNUP.description,
    url: routes.SIGNUP.path,
  },
  alternates: {
    canonical: routes.SIGNUP.path,
  },
};

export { default } from "@/src/containers/signup";
