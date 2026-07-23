"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "./logout";

/**
 * 로그아웃 mutation — 서버 실패 여부와 무관하게(onSettled) 캐시를 비우고 로그인 화면으로 이동한다.
 * 하드 이동(location.replace)이라 메모리에 남은 이전 계정 상태까지 페이지 언로드로 확실히 버려진다.
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.clear();
      window.location.replace("/login");
    },
  });
}
