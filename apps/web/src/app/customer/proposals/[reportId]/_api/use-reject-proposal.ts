"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { proposalKeys } from "@/shared/api/query-keys";
import { rejectProposal } from "./reject-proposal";
import type { ProposalList } from "../_model/proposal.schema";

/**
 * 제안 거절 뮤테이션. 사유 없이 바로 거절.
 * 낙관적 제외: onMutate에서 해당 adjusterId 카드 제거 + totalElements 감소, 실패 시 롤백.
 */
export function useRejectProposal(reportId: string) {
  const queryClient = useQueryClient();
  const queryKey = proposalKeys.list(reportId).queryKey;

  return useMutation({
    mutationFn: (adjusterId: string) => rejectProposal(reportId, adjusterId),
    onMutate: async (adjusterId: string) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<ProposalList>(queryKey);

      if (previous) {
        queryClient.setQueryData<ProposalList>(queryKey, {
          list: previous.list.filter((p) => p.adjusterId !== adjusterId),
          pagination: {
            ...previous.pagination,
            totalElements: Math.max(0, previous.pagination.totalElements - 1),
          },
        });
      }

      return { previous };
    },
    onError: (_error, _adjusterId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
