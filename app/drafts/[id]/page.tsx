"use client";
import React, { use } from "react";
import DraftDetailPage from "@/src/containers/drafts/detail";

export default function DraftDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <DraftDetailPage draftId={id} />;
}
