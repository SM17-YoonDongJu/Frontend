"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "@/shared/api/query-keys";
import { applyAdjuster } from "./apply-adjuster";

// 자격 신청 흐름에서 발생 가능한 api-spec 에러코드.
// fetchJson이 실패 봉투의 `code`를 Error.name에 담아 throw → 아래 헬퍼로 분기.
export type ApplyAdjusterErrorCode =
  | "MISSING_REQUIRED_FIELD"
  | "VALIDATION_ERROR"
  | "DUPLICATE_RESOURCE"
  | "LOGIN_REQUIRED"
  | "EXTERNAL_API_ERROR";

const KNOWN_CODES: ApplyAdjusterErrorCode[] = [
  "MISSING_REQUIRED_FIELD",
  "VALIDATION_ERROR",
  "DUPLICATE_RESOURCE",
  "LOGIN_REQUIRED",
  "EXTERNAL_API_ERROR",
];

/** 뮤테이션 error(unknown)에서 서버 code를 뽑아 UI 분기용으로 노출. 미상이면 null. */
export function getApplyAdjusterErrorCode(
  error: unknown,
): ApplyAdjusterErrorCode | null {
  const name = error instanceof Error ? error.name : "";
  return KNOWN_CODES.includes(name as ApplyAdjusterErrorCode)
    ? (name as ApplyAdjusterErrorCode)
    : null;
}

// 성공 시 상태 쿼리 무효화 → /status 이동 후 최신 PENDING을 다시 조회.
export function useApplyAdjuster() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: applyAdjuster,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.adjusterApplication.queryKey,
      });
    },
  });
}
