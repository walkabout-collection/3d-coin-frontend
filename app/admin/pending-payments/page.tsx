import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pending Payments | Legacy Forge",
  description: "Review pending payments awaiting reconciliation.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export { default } from "@/src/containers/admin/pending-payments";
