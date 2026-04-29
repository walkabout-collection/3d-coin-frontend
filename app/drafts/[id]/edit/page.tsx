import type { Metadata } from "next";
import { internalRoutes, noindexRobots } from "@/src/constants/internalRoutes";
import DraftEditPage from "@/src/containers/drafts/edit";

export const metadata: Metadata = {
  ...internalRoutes.DRAFT_EDIT,
  robots: noindexRobots,
};

export default async function DraftEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DraftEditPage draftId={id} />;
}
