"use client";

import { AsyncBoundary } from "@/shared/ui/AsyncBoundary";
import { InProgressCases } from "./InProgressCases";
import { InProgressSkeleton } from "./InProgressSkeleton";

export function InProgressBoundary() {
  return (
    <AsyncBoundary fallback={<InProgressSkeleton />} errorLayout="card">
      <InProgressCases />
    </AsyncBoundary>
  );
}
