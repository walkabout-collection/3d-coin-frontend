import type { Metadata } from "next";
import DraftsPage from "@/src/containers/drafts";

export const metadata: Metadata = {
  title: "Drafts | Legacy Forge",
  description: "Manage your saved coin design drafts.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function Drafts() {
  return <DraftsPage />;
}
