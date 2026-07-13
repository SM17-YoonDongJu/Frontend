"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense, type ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useHydrated } from "@/shared/lib/use-hydrated";
import { Button } from "@/shared/ui/Button";

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
  if (!useHydrated()) return <>{fallback}</>;

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary }) => (
            <div className="flex flex-col items-center rounded-card border border-line bg-card px-6 py-10 text-center">
              <p className="text-[0.9375rem] font-semibold text-ink">{errorTitle}</p>
              <p className="mt-1 text-[0.8125rem] text-ink-3">잠시 후 다시 시도해 주세요.</p>
              <Button size="sm" variant="outline" className="mt-4" onClick={resetErrorBoundary}>
                다시 시도
              </Button>
            </div>
          )}
        >
          <Suspense fallback={fallback}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

/** 회색 펄스 블록 스켈레톤. */
export function SectionSkeleton({ className = "h-40" }: { className?: string }) {
  return <div className={`animate-pulse rounded-card bg-line-2 ${className}`} />;
}
