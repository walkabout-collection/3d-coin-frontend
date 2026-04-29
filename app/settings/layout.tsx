import type { Metadata } from "next";
import { internalRoutes, noindexRobots } from "@/src/constants/internalRoutes";

export const metadata: Metadata = {
  ...internalRoutes.SETTINGS,
  robots: noindexRobots,
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
