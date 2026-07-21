"use client";

import { AsyncBoundary } from "@/shared/ui/AsyncBoundary";
import { AdjusterListSkeleton } from "./AdjusterListSkeleton";
import { AdjusterListView } from "./AdjusterListView";

export function AdjusterListBoundary() {
  return (
    <AsyncBoundary
      fallback={<AdjusterListSkeleton />}
      errorLayout="page"
      errorTitle="손해사정사 목록을 불러오지 못했어요"
    >
      <AdjusterListView />
    </AsyncBoundary>
  );
}
