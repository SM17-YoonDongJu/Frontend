"use client";

import { AsyncBoundary } from "@/shared/ui/AsyncBoundary";
import { ActivityStats } from "./ActivityStats";
import { ActivitySkeleton } from "./ActivitySkeleton";

export function ActivityBoundary() {
  return (
    <AsyncBoundary fallback={<ActivitySkeleton />} errorLayout="card">
      <ActivityStats />
    </AsyncBoundary>
  );
}
