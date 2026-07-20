"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "@/shared/api/query-keys";
import { register } from "./register";

// 전역 에러코드 enum(api-spec.md) 중 register 흐름에서 발생 가능한 code.
// fetchJson이 실패 봉투의 `code`를 Error.name에 담아 throw → 아래 헬퍼로 분기.
export type RegisterErrorCode =
  | "MISSING_REQUIRED_FIELD"
  | "VALIDATION_ERROR"
  | "DUPLICATE_RESOURCE"
  | "EXTERNAL_API_ERROR";

/** 뮤테이션 error(unknown)에서 서버 code를 뽑아 UI 분기용으로 노출. 미상이면 null. */
export function getRegisterErrorCode(error: unknown): RegisterErrorCode | null {
  const name = error instanceof Error ? error.name : "";
  const known: RegisterErrorCode[] = [
    "MISSING_REQUIRED_FIELD",
    "VALIDATION_ERROR",
    "DUPLICATE_RESOURCE",
    "EXTERNAL_API_ERROR",
  ];
  return known.includes(name as RegisterErrorCode)
    ? (name as RegisterErrorCode)
    : null;
}

// 성공 시 user.me 캐시만 무효화. 토큰은 HttpOnly 쿠키(Set-Cookie)로 세팅되므로 FE 저장 로직 없음 —
// 응답 data는 { userId, nickname, role }뿐(토큰 미포함).
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me.queryKey });
    },
  });
}
