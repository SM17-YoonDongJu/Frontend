"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "@/shared/api/query-keys";
import { passwordSignup } from "./password-signup";

/**
 * 아이디·비밀번호 가입. 성공 응답의 Set-Cookie로 세션이 이미 서 있으므로
 * user.me만 무효화하면 화면이 로그인 상태로 전환된다(로그인 API 재호출 없음).
 */
export function usePasswordSignup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: passwordSignup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me.queryKey });
    },
  });
}
