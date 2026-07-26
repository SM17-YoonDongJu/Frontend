"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { withdraw } from "./withdraw";

/**
 * 회원 탈퇴 mutation — 성공했을 때만 캐시를 비우고 랜딩으로 하드 이동한다.
 * 실패 시엔 세션이 그대로 살아 있으므로 정리·이동 없이 호출부가 에러를 안내하고 재시도한다.
 */
export function useWithdraw() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: withdraw,
    onSuccess: () => {
      queryClient.clear();
      window.location.replace("/");
    },
  });
}
