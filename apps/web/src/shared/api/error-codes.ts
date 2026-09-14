import { ZodError } from "zod";

export const ERROR_CODES = {
  INVALID_REQUEST: "INVALID_REQUEST",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  MISSING_REQUIRED_FIELD: "MISSING_REQUIRED_FIELD",
  UNSUPPORTED_OPERATION: "UNSUPPORTED_OPERATION",
  // oauth 콜백 미지원 provider (명세 2026-07-07: UNSUPPORTED_OPERATION → UNSUPPORTED_PROVIDER)
  UNSUPPORTED_PROVIDER: "UNSUPPORTED_PROVIDER",
  INVALID_TOKEN: "INVALID_TOKEN",
  EXPIRED_TOKEN: "EXPIRED_TOKEN",
  LOGIN_REQUIRED: "LOGIN_REQUIRED",
  REFRESH_TOKEN_NOT_FOUND: "REFRESH_TOKEN_NOT_FOUND",
  FORBIDDEN: "FORBIDDEN",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  POST_NOT_FOUND: "POST_NOT_FOUND",
  REPORT_NOT_FOUND: "REPORT_NOT_FOUND",
  // 채팅방 공유 리포트(GET /chats/{id}/shared-report) 전용 — api-spec.md 전역 표 반영됨
  CHAT_NOT_A_MEMBER: "CHAT_NOT_A_MEMBER",
  CHAT_ROOM_NOT_FOUND: "CHAT_ROOM_NOT_FOUND",
  PROPOSAL_NOT_FOUND: "PROPOSAL_NOT_FOUND",
  // CONTRACT: 명세 register 400이 BAD_REQUEST 사용 — INVALID_REQUEST와 이중, 백엔드 단일화 확인 필요
  BAD_REQUEST: "BAD_REQUEST",
  SUBSCRIPTION_NOT_FOUND: "SUBSCRIPTION_NOT_FOUND",
  DUPLICATE_RESOURCE: "DUPLICATE_RESOURCE",
  UPLOAD_CONTENT_TYPE_NOT_ALLOWED: "UPLOAD_CONTENT_TYPE_NOT_ALLOWED",
  UPLOAD_FILE_EMPTY: "UPLOAD_FILE_EMPTY",
  UPLOAD_FILE_TOO_LARGE: "UPLOAD_FILE_TOO_LARGE",
  PAYMENT_FAILED: "PAYMENT_FAILED",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  DATABASE_ERROR: "DATABASE_ERROR",
  EXTERNAL_API_ERROR: "EXTERNAL_API_ERROR",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
} as const;


/** 로그인 안내 화면(/login-required)으로 보내야 하는 인증 에러. EXPIRED_TOKEN은 재발급 루트가 따로 처리. */
const AUTH_REDIRECT_CODES: ReadonlySet<string> = new Set([
  ERROR_CODES.LOGIN_REQUIRED,
  ERROR_CODES.INVALID_TOKEN,
  ERROR_CODES.REFRESH_TOKEN_NOT_FOUND,
]);

export function isAuthRedirectError(error: unknown): boolean {
  const code = getErrorCode(error);
  return code !== null && AUTH_REDIRECT_CODES.has(code);
}

/** client 규약: 서버 실패 응답 래퍼의 code가 Error.name에 담긴다. */
export function getErrorCode(error: unknown): string | null {
  if (!(error instanceof Error)) return null;
  return error.name === "Error" ? null : error.name;
}

/** 서버 상태가 바뀌면 풀릴 수 있는 일시 장애 — 다시 요청할 가치가 있다. */
const RETRYABLE_SERVER_CODES: ReadonlySet<string> = new Set([
  ERROR_CODES.INTERNAL_SERVER_ERROR,
  ERROR_CODES.DATABASE_ERROR,
  ERROR_CODES.EXTERNAL_API_ERROR,
  ERROR_CODES.SERVICE_UNAVAILABLE,
]);

/**
 * 쿼리 재시도 여부. 응답 검증 실패와 요청·권한 오류는 몇 번을 다시 보내도 결과가 같아서,
 * 재시도하면 사용자만 빈 로딩을 몇 초 더 본다(#314). 네트워크 오류(코드 없음)와 서버 장애만 재시도한다.
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof ZodError) return false;
  const code = getErrorCode(error);
  return code === null || RETRYABLE_SERVER_CODES.has(code);
}
