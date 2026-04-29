import type { Metadata } from "next";
import DraftDetailPage from "@/src/containers/drafts/detail";

export const metadata: Metadata = {
  title: "Draft Detail | Legacy Forge",
  description: "Review the details of your saved coin design draft.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default async function DraftDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DraftDetailPage draftId={id} />;
}
