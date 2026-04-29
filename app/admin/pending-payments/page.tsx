import type { Metadata } from "next";
import { internalRoutes, noindexRobots } from "@/src/constants/internalRoutes";

export const metadata: Metadata = {
  ...internalRoutes.ADMIN_PENDING_PAYMENTS,
  robots: noindexRobots,
};

export { default } from "@/src/containers/admin/pending-payments";
