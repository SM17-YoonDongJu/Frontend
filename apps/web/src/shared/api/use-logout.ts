"use client";

import { isBridgeAvailable } from "@insurance/bridge/web";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  clearRegisteredDeviceToken,
  loadRegisteredDeviceToken,
} from "@/shared/lib/device-token-storage";
import { deleteDeviceToken } from "./delete-device-token";
import { logout } from "./logout";

/**
 * 로그아웃 mutation — 서버 실패 여부와 무관하게(onSettled) 캐시를 비우고 로그인 화면으로 이동한다.
 * 하드 이동(location.replace)이라 메모리에 남은 이전 계정 상태까지 페이지 언로드로 확실히 버려진다.
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // 로그아웃한 기기로 푸시가 가지 않도록 세션이 살아있을 때 기기 토큰을 먼저 해제.
      // 해제 실패가 로그아웃을 막으면 안 되므로 best-effort.
      if (isBridgeAvailable()) {
        const registered = loadRegisteredDeviceToken();
        if (registered) {
          try {
            await deleteDeviceToken(registered.token);
            clearRegisteredDeviceToken();
          } catch {}
        }
      }
      return logout();
    },
    onSettled: () => {
      queryClient.clear();
      window.location.replace("/login");
    },
  });
}
