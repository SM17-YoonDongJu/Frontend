"use client";

import { useMutation } from "@tanstack/react-query";
import { rejectProposal } from "./reject-proposal";

/**
 * 제안 거절 뮤테이션. 사유 없이 바로 거절.
 * 거절 성공 시 카드는 목록에 유지하되 회색·버튼 잠금 처리(세션 상태 markRejected).
 * 목록에서 제거하지 않으므로 캐시 조작/무효화 없음.
 */
export function useRejectProposal(reportId: string) {
  return useMutation({
    mutationFn: (adjusterId: string) => rejectProposal(reportId, adjusterId),
  });
}
