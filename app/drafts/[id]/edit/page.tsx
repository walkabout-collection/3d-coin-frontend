"use client";
import React, { use } from "react";
import DraftEditPage from "@/src/containers/drafts/edit";

export default function DraftEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <DraftEditPage draftId={id} />;
}
