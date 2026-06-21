"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewKeys } from "@/shared/api/query-keys";
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
      queryClient.invalidateQueries({ queryKey: reviewKeys.pending._def });
    },
  });
}
