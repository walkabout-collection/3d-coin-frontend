import { Metadata } from "next";
import { routes } from "@/src/constants/routes";

export const metadata: Metadata = {
  title: routes.QUOTES.metaTitle,
  description: routes.QUOTES.description,
  openGraph: {
    title: routes.QUOTES.metaTitle,
    description: routes.QUOTES.description,
    url: routes.QUOTES.path,
  },
  alternates: {
    canonical: routes.QUOTES.path,
  },
};

export { default } from "@/src/containers/quotes";
