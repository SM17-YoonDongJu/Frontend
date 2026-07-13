"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatKeys, proposalKeys, reportKeys } from "@/shared/api/query-keys";
import { matchProposal } from "./match-proposal";

/**
 * 제안 채택·거절 통합 mutation 훅. 채팅 헤더(채택/거절)·proposals 카드(거절) 공용.
 * 형제 방 캐스케이드(백엔드 계산)를 반영하려면 chatKeys.list 무효화 필수 → 낙관적 업데이트 없이 재조회.
 */
export function useMatchProposal(reportId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: {
      proposalId: string;
      status: "ACCEPTED" | "REJECTED";
    }) => matchProposal(reportId, variables.proposalId, variables.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.list.queryKey });
      queryClient.invalidateQueries({
        queryKey: proposalKeys.list(reportId).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: reportKeys.detail(reportId).queryKey,
      });
    },
  });
}
