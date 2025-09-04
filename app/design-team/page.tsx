import { Metadata } from "next";
import { routes } from "@/src/constants/routes";

export const metadata: Metadata = {
  title: routes.DESIGN_TEAM.metaTitle,
  description: routes.DESIGN_TEAM.description,
  openGraph: {
    title: routes.DESIGN_TEAM.metaTitle,
    description: routes.DESIGN_TEAM.description,
    url: routes.DESIGN_TEAM.path,
  },
  alternates: {
    canonical: routes.DESIGN_TEAM.path,
  },
};

export { default } from "@/src/containers/design-team";
