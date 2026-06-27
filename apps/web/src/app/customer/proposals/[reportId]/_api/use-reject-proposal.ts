"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { proposalKeys } from "@/shared/api/query-keys";
import { rejectProposal } from "./reject-proposal";

/**
 * 제안 거절 mutation 훅. 사유 없이 바로 거절.
 * 명세상 거절한 제안은 목록에서 제외되므로, 성공 시 제안 목록을 갱신해 카드를 제거한다.
 */
export function useRejectProposal(reportId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (adjusterId: string) => rejectProposal(reportId, adjusterId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: proposalKeys.list(reportId).queryKey }),
  });
}
