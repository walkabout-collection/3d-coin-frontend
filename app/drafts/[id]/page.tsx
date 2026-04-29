import type { Metadata } from "next";
import { internalRoutes, noindexRobots } from "@/src/constants/internalRoutes";
import DraftDetailPage from "@/src/containers/drafts/detail";

export const metadata: Metadata = {
  ...internalRoutes.DRAFT_DETAIL,
  robots: noindexRobots,
};

export default async function DraftDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DraftDetailPage draftId={id} />;
}
