import { Metadata } from "next";
import { routes } from "@/src/constants/routes";

export const metadata: Metadata = {
  title: routes.CONTACT_US.metaTitle,
  description: routes.CONTACT_US.description,
  openGraph: {
    title: routes.CONTACT_US.metaTitle,
    description: routes.CONTACT_US.description,
    url: routes.CONTACT_US.path,
  },
  alternates: {
    canonical: routes.CONTACT_US.path,
  },
};

export { default } from "@/src/containers/contact-us";
