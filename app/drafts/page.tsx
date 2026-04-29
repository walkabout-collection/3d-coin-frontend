import type { Metadata } from "next";
import { internalRoutes, noindexRobots } from "@/src/constants/internalRoutes";
import DraftsPage from "@/src/containers/drafts";

export const metadata: Metadata = {
  ...internalRoutes.DRAFTS,
  robots: noindexRobots,
};

export default function Drafts() {
  return <DraftsPage />;
}
