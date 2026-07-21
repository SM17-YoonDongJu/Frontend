"use client";

import { AsyncBoundary } from "@/shared/ui/AsyncBoundary";
import { MobileSummaryGrid } from "./MobileSummaryGrid";
import { MobileSummarySkeleton } from "./MobileSummarySkeleton";

export function MobileSummaryBoundary() {
  return (
    <AsyncBoundary fallback={<MobileSummarySkeleton />} errorLayout="card">
      <MobileSummaryGrid />
    </AsyncBoundary>
  );
}
