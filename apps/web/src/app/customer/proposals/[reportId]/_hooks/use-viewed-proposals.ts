"use client";

import { createContext, createElement, useContext, useState } from "react";
import type { ReactNode } from "react";

/**
 * 제안 카드 세션 상태(메모리). 새로고침 시 초기화(서버 저장 안 함).
 * - 조회: "검수 의견 보기" 진입한 사정사(adjusterId) → 카드 톤다운.
 *   (거절은 서버에서 목록 제외 처리하므로 세션 상태로 두지 않는다.)
 */
interface ViewedProposalsValue {
  isViewed: (adjusterId: string) => boolean;
  markViewed: (adjusterId: string) => void;
}

const ViewedProposalsContext = createContext<ViewedProposalsValue | null>(null);

export function ViewedProposalsProvider({ children }: { children: ReactNode }) {
  const [viewedIds, setViewedIds] = useState<ReadonlySet<string>>(() => new Set());

  const markViewed = (adjusterId: string) =>
    setViewedIds((prev) => {
      if (prev.has(adjusterId)) return prev;
      const next = new Set(prev);
      next.add(adjusterId);
      return next;
    });

  const value: ViewedProposalsValue = {
    isViewed: (adjusterId) => viewedIds.has(adjusterId),
    markViewed,
  };

  return createElement(ViewedProposalsContext.Provider, { value }, children);
}

export function useViewedProposals(): ViewedProposalsValue {
  const value = useContext(ViewedProposalsContext);
  if (!value) {
    throw new Error("useViewedProposals must be used within ViewedProposalsProvider");
  }
  return value;
}
