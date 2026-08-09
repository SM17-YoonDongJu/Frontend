"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adjusterKeys } from "@/shared/api/query-keys";
import { createReview } from "./create-review";
import type { CreateReviewBody } from "../_model/review.schema";

export function useCreateReview(adjusterId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateReviewBody) => createReview(adjusterId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adjusterKeys.detail(adjusterId).queryKey });
    },
  });
}
