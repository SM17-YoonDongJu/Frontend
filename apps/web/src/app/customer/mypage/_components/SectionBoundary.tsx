"use client";

import type { ReactNode } from "react";
import { AsyncBoundary } from "@/shared/ui/AsyncBoundary";

interface SectionBoundaryProps {
  children: ReactNode;
  /** 로딩 스켈레톤(섹션마다 높이가 달라 소비처가 넘김) */
  fallback: ReactNode;
  errorTitle?: string;
}

/**
 * 섹션 단위 Suspense + Error 경계. 한 섹션 실패가 페이지 전체를 무너뜨리지 않게 분리(dashboard 관례).
 */
export function SectionBoundary({
  children,
  fallback,
  errorTitle = "불러오지 못했어요",
}: SectionBoundaryProps) {
  return (
    <AsyncBoundary fallback={fallback} errorLayout="card" errorTitle={errorTitle}>
      {children}
    </AsyncBoundary>
  );
}
