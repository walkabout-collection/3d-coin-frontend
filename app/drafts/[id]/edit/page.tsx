import type { Metadata } from "next";
import DraftEditPage from "@/src/containers/drafts/edit";

export const metadata: Metadata = {
  title: "Edit Draft | Legacy Forge",
  description: "Edit your saved coin design draft.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default async function DraftEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DraftEditPage draftId={id} />;
}
