"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatKeys, proposalKeys, reportKeys } from "@/shared/api/query-keys";
import { acceptChat } from "./accept-chat";

/**
 * 상담 수락(매칭 완료). 형제 방 종료 캐스케이드는 서버 책임 → 성공 시 목록·리포트·제안 재조회로 반영.
 */
export function useAcceptChat(chatRoomId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => acceptChat(chatRoomId),
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
