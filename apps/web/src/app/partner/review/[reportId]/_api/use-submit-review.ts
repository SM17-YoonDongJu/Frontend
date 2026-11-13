"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reportKeys, reviewKeys } from "@/shared/api/query-keys";
import type { ReviewSubmit } from "../_model/types";
import { submitReview } from "./submit-review";

export function useSubmitReview(reportId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: ReviewSubmit) => submitReview(reportId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: reviewKeys.detail(reportId).queryKey,
      });
      queryClient.invalidateQueries({ queryKey: reportKeys.pendingReview._def });
      // 검수 대기 화면은 무한 조회 키를 쓴다 — 접두사가 달라 위 키로는 갱신되지 않는다.
      queryClient.invalidateQueries({ queryKey: reportKeys.pendingReviewInfinite._def });
    },
  });
}
