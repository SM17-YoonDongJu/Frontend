"use client";

import { DashboardHome } from "./DashboardHome";
import { SectionBoundary } from "./SectionBoundary";
import { SectionSkeleton } from "./SectionSkeleton";

export function DashboardView() {
  return (
    <SectionBoundary
      errorTitle="홈 화면을 불러오지 못했어요"
      fallback={<SectionSkeleton height="30rem" />}
    >
      <DashboardHome />
    </SectionBoundary>
  );
}
