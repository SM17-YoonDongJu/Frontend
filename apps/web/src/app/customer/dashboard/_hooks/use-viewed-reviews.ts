"use client";

import { createContext, createElement, useContext, useState } from "react";
import type { ReactNode } from "react";

/**
 * 검수완료 알림 세션 상태(메모리). 새로고침 시 초기화(서버 저장 안 함).
 * "검수 확인" 진입한 리포트(reportId) → 알림에서 톤다운/숨김.
 */
interface ViewedReviewsValue {
  isViewed: (reportId: string) => boolean;
  markViewed: (reportId: string) => void;
}

const ViewedReviewsContext = createContext<ViewedReviewsValue | null>(null);

export function ViewedReviewsProvider({ children }: { children: ReactNode }) {
  const [viewedIds, setViewedIds] = useState<ReadonlySet<string>>(() => new Set());

  const value: ViewedReviewsValue = {
    isViewed: (reportId) => viewedIds.has(reportId),
    markViewed: (reportId) =>
      setViewedIds((prev) => {
        if (prev.has(reportId)) return prev;
        const next = new Set(prev);
        next.add(reportId);
        return next;
      }),
  };

  return createElement(ViewedReviewsContext.Provider, { value }, children);
}

export function useViewedReviews(): ViewedReviewsValue {
  const value = useContext(ViewedReviewsContext);
  if (!value) {
    throw new Error("useViewedReviews must be used within ViewedReviewsProvider");
  }
  return value;
}
