"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adjusterKeys, reportKeys } from "@/shared/api/query-keys";
import { createReview } from "./create-review";
import type { CreateReviewBody } from "../_model/review.schema";

export function useCreateReview(reportId: string, adjusterId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateReviewBody) => createReview(adjusterId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adjusterKeys.detail(adjusterId).queryKey });
      queryClient.invalidateQueries({ queryKey: reportKeys.detail(reportId).queryKey });
    },
  });
}
