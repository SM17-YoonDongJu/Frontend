"use client";

import { createContext, createElement, useContext, useState } from "react";
import type { ReactNode } from "react";

/**
 * 제안 카드 세션 상태(메모리). 새로고침 시 초기화(서버 저장 안 함).
 * - 조회: "검수 의견 보기" 진입한 사정사(adjusterId) → 카드 톤다운.
 * - 거절: 거절한 사정사(adjusterId) → 카드 회색·버튼 잠금(목록 유지).
 */
interface ViewedProposalsValue {
  isViewed: (adjusterId: string) => boolean;
  markViewed: (adjusterId: string) => void;
  isRejected: (adjusterId: string) => boolean;
  markRejected: (adjusterId: string) => void;
}

const ViewedProposalsContext = createContext<ViewedProposalsValue | null>(null);

export function ViewedProposalsProvider({ children }: { children: ReactNode }) {
  const [viewedIds, setViewedIds] = useState<ReadonlySet<string>>(() => new Set());
  const [rejectedIds, setRejectedIds] = useState<ReadonlySet<string>>(() => new Set());

  const addId = (
    setter: typeof setViewedIds,
  ): ((adjusterId: string) => void) => (adjusterId) =>
    setter((prev) => {
      if (prev.has(adjusterId)) return prev;
      const next = new Set(prev);
      next.add(adjusterId);
      return next;
    });

  const value: ViewedProposalsValue = {
    isViewed: (adjusterId) => viewedIds.has(adjusterId),
    markViewed: addId(setViewedIds),
    isRejected: (adjusterId) => rejectedIds.has(adjusterId),
    markRejected: addId(setRejectedIds),
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
