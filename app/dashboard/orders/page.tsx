import { Metadata } from "next";
import { routes } from "@/src/constants/routes";

export const metadata: Metadata = {
  title: routes.ORDERS.metaTitle,
  description: routes.ORDERS.description,
  openGraph: {
    title: routes.ORDERS.metaTitle,
    description: routes.ORDERS.description,
    url: routes.ORDERS.path,
  },
  alternates: {
    canonical: routes.ORDERS.path,
  },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export { default } from "@/src/containers/orders";
