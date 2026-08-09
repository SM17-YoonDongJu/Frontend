"use client";

import { AsyncBoundary } from "@/shared/ui/AsyncBoundary";
import { SummaryCards } from "./SummaryCards";
import { SummaryCardsSkeleton } from "./SummaryCardsSkeleton";

export function SummaryCardsBoundary() {
  return (
    <AsyncBoundary
      fallback={<SummaryCardsSkeleton />}
      errorLayout="card"
      errorClassName="md:col-span-4"
    >
      <SummaryCards />
    </AsyncBoundary>
  );
}
