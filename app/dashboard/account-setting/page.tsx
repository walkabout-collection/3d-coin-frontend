import { Metadata } from "next";
import { routes } from "@/src/constants/routes";

export const metadata: Metadata = {
  title: routes.ACCOUNT_SETTING.metaTitle,
  description: routes.ACCOUNT_SETTING.description,
  openGraph: {
    title: routes.ACCOUNT_SETTING.metaTitle,
    description: routes.ACCOUNT_SETTING.description,
    url: routes.ACCOUNT_SETTING.path,
  },
  alternates: {
    canonical: routes.ACCOUNT_SETTING.path,
  },
};

export { default } from "@/src/containers/account-setting";
