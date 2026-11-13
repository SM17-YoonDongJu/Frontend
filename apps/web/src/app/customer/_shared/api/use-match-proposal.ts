"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatKeys, proposalKeys, reportKeys } from "@/shared/api/query-keys";
import { matchProposal } from "./match-proposal";

/**
 * 상담 수락·거절 mutation 훅. ACCEPTED는 상담 채팅방을 열고 응답으로 방 id를 돌려준다.
 * 최종 채택(매칭 완료)은 이 훅이 아니라 useAcceptChat을 쓴다(#325).
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
