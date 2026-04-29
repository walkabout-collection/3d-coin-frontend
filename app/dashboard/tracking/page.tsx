import type { Metadata } from "next";
import { internalRoutes, noindexRobots } from "@/src/constants/internalRoutes";

export const metadata: Metadata = {
  ...internalRoutes.DASHBOARD_TRACKING,
  robots: noindexRobots,
};

export default function TrackingPageDisabled() {
  return null;
}
