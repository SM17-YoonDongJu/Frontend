"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "@/shared/api/query-keys";
import { passwordLogin } from "./password-login";

/**
 * 아이디·비밀번호 로그인. 세션은 HttpOnly 쿠키라 FE 저장 로직이 없고,
 * user.me 무효화로 로그인 상태가 되면 기존 로그인 리다이렉트 훅이 역할별 홈으로 보낸다.
 */
export function usePasswordLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: passwordLogin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me.queryKey });
    },
  });
}
