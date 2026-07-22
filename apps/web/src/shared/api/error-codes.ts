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
  // CONTRACT: 명세 register 400이 BAD_REQUEST 사용 — INVALID_REQUEST와 이중, 백엔드 단일화 확인 필요
  BAD_REQUEST: "BAD_REQUEST",
  SUBSCRIPTION_NOT_FOUND: "SUBSCRIPTION_NOT_FOUND",
  DUPLICATE_RESOURCE: "DUPLICATE_RESOURCE",
  PAYMENT_FAILED: "PAYMENT_FAILED",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  DATABASE_ERROR: "DATABASE_ERROR",
  EXTERNAL_API_ERROR: "EXTERNAL_API_ERROR",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

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

/** fetchJson 규약: 서버 실패 봉투의 code가 Error.name에 담긴다(없으면 `HTTP_<status>`). */
export function getErrorCode(error: unknown): string | null {
  if (!(error instanceof Error)) return null;
  return error.name === "Error" ? null : error.name;
}
