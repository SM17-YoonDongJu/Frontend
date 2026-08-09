"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { releaseRegisteredDeviceToken } from "./release-registered-device-token";
import { withdraw } from "./withdraw";

/**
 * 회원 탈퇴 mutation — 성공했을 때만 캐시를 비우고 랜딩으로 하드 이동한다.
 * 실패 시엔 세션이 그대로 살아 있으므로 정리·이동 없이 호출부가 에러를 안내하고 재시도한다.
 */
export function useWithdraw() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // 탈퇴한 계정의 기기로 푸시가 가지 않도록 세션이 살아있을 때 기기 토큰을 먼저 해제.
      await releaseRegisteredDeviceToken();
      return withdraw();
    },
    onSuccess: () => {
      queryClient.clear();
      window.location.replace("/");
    },
  });
}
