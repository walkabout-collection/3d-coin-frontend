import type { Metadata } from "next";
import { internalRoutes, noindexRobots } from "@/src/constants/internalRoutes";

export const metadata: Metadata = {
  ...internalRoutes.PAYMENT,
  robots: noindexRobots,
};

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
