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
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export { default } from "@/src/containers/quotes";
