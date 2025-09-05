import { Metadata } from "next";
import { routes } from "@/src/constants/routes";

export const metadata: Metadata = {
  title: routes.BLOGS.metaTitle,
  description: routes.BLOGS.description,
  openGraph: {
    title: routes.BLOGS.metaTitle,
    description: routes.BLOGS.description,
    url: routes.BLOGS.path,
  },
  alternates: {
    canonical: routes.BLOGS.path,
  },
};

export { default } from "@/src/containers/blogs";
