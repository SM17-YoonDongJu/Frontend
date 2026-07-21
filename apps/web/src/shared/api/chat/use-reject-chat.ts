"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatKeys, proposalKeys, reportKeys } from "@/shared/api/query-keys";
import { rejectChat } from "./reject-chat";

/**
 * 상담 거절(매칭 거절 / 상담 종료). 방만 종료되고 형제는 유지 → 성공 시 목록·리포트·제안 재조회.
 */
export function useRejectChat(chatRoomId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => rejectChat(chatRoomId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.list.queryKey });
      queryClient.invalidateQueries({
        queryKey: reportKeys.detail(data.reportId).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: proposalKeys.list(data.reportId).queryKey,
      });
    },
  });
}
