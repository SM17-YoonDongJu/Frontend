"use client";

import { AsyncBoundary } from "@/shared/ui/AsyncBoundary";
import { MobilePendingList } from "./MobilePendingList";
import { MobilePendingSkeleton } from "./MobilePendingSkeleton";

export function MobilePendingBoundary() {
  return (
    <AsyncBoundary fallback={<MobilePendingSkeleton />} errorLayout="card">
      <MobilePendingList />
    </AsyncBoundary>
  );
}
