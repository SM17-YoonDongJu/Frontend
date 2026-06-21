"use client";

import { createContext, createElement, useContext, useState } from "react";
import type { ReactNode } from "react";

/**
 * 조회 이력(세션 메모리). "검수 의견 보기" 진입한 사정사(adjusterId)를 기록해
 * 해당 카드를 톤다운한다. 새로고침 시 초기화(서버 저장 안 함).
 */
interface ViewedProposalsValue {
  isViewed: (adjusterId: string) => boolean;
  markViewed: (adjusterId: string) => void;
}

const ViewedProposalsContext = createContext<ViewedProposalsValue | null>(null);

export function ViewedProposalsProvider({ children }: { children: ReactNode }) {
  const [viewedIds, setViewedIds] = useState<ReadonlySet<string>>(() => new Set());

  const isViewed = (adjusterId: string) => viewedIds.has(adjusterId);
  const markViewed = (adjusterId: string) =>
    setViewedIds((prev) => {
      if (prev.has(adjusterId)) return prev;
      const next = new Set(prev);
      next.add(adjusterId);
      return next;
    });

  return createElement(
    ViewedProposalsContext.Provider,
    { value: { isViewed, markViewed } },
    children,
  );
}

export function useViewedProposals(): ViewedProposalsValue {
  const value = useContext(ViewedProposalsContext);
  if (!value) {
    throw new Error("useViewedProposals must be used within ViewedProposalsProvider");
  }
  return value;
}
