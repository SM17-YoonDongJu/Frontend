"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reportKeys } from "@/shared/api/query-keys";
import { holdReview } from "./hold-review";

export function useHoldReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: holdReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.pendingReview._def });
      // 검수 대기 화면은 무한 조회 키를 쓴다 — 접두사가 달라 위 키로는 갱신되지 않는다.
      queryClient.invalidateQueries({ queryKey: reportKeys.pendingReviewInfinite._def });
      queryClient.invalidateQueries({ queryKey: reportKeys.pendingReviewSummary._def });
    },
  });
}
