import { adminRoutes } from "@/src/constants/routes";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: adminRoutes.ACCOUNT_SETTING.metaTitle,
  description: adminRoutes.ACCOUNT_SETTING.description,
  openGraph: {
    title: adminRoutes.ACCOUNT_SETTING.metaTitle,
    description: adminRoutes.ACCOUNT_SETTING.description,
    url: adminRoutes.ACCOUNT_SETTING.path,
  },
  alternates: {
    canonical: adminRoutes.ACCOUNT_SETTING.path,
  },
};

export { default } from "@/src/containers/admin/account-setting";
