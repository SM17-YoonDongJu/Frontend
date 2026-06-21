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
      queryClient.invalidateQueries({ queryKey: reportKeys.pendingReviewSummary._def });
    },
  });
}
