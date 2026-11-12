import { ERROR_CODES, getErrorCode } from "@/shared/api/error-codes";

/** 아이디·비밀번호 인증 흐름에서 발생 가능한 서버 code. */
export type PasswordAuthErrorCode =
  | typeof ERROR_CODES.DUPLICATE_RESOURCE
  | typeof ERROR_CODES.LOGIN_FAILED
  | typeof ERROR_CODES.BAD_REQUEST;

const KNOWN_CODES: PasswordAuthErrorCode[] = [
  ERROR_CODES.DUPLICATE_RESOURCE,
  ERROR_CODES.LOGIN_FAILED,
  ERROR_CODES.BAD_REQUEST,
];

/** 폼 필드 중 하나로 귀속되는 에러인지 구분 — 필드가 특정되면 그 입력 아래, 아니면 폼 상단. */
export type PasswordAuthField = "loginId" | "password" | "name";

export interface PasswordAuthErrorView {
  /** 특정 입력에 귀속되면 그 필드, 폼 전체 에러면 null */
  field: PasswordAuthField | null;
  message: string;
}

const FALLBACK_MESSAGE = "요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.";

const SPEC_FIELD_TO_FORM: Record<string, PasswordAuthField> = {
  login_id: "loginId",
  loginId: "loginId",
  password: "password",
  name: "name",
};

/**
 * 400 BAD_REQUEST의 message는 `login_id: 아이디는 영문·숫자·밑줄 4~20자여야 합니다.` 형태로
 * 첫 번째 위반 필드 하나만 담긴다. 콜론 앞이 알려진 필드명이면 그 입력에 붙이고 문구는 뒤쪽만 쓴다.
 * 형태가 다르면 자르지 않고 서버 문구를 그대로 폼 상단에 보여준다.
 */
function parseFieldViolation(message: string): PasswordAuthErrorView {
  const separator = message.indexOf(":");
  if (separator === -1) return { field: null, message };

  const field = SPEC_FIELD_TO_FORM[message.slice(0, separator).trim()];
  if (!field) return { field: null, message };

  const detail = message.slice(separator + 1).trim();
  return { field, message: detail === "" ? message : detail };
}

export function getPasswordAuthErrorCode(error: unknown): PasswordAuthErrorCode | null {
  const code = getErrorCode(error);
  return KNOWN_CODES.find((known) => known === code) ?? null;
}

/**
 * 뮤테이션 error(unknown) → 폼에 붙일 필드·문구.
 *
 * - 409 DUPLICATE_RESOURCE: 이미 사용 중인 아이디 → 아이디 입력에 귀속
 * - 401 LOGIN_FAILED: 서버 문구 그대로. 아이디 없음·비밀번호 불일치·탈퇴 계정을 백엔드가
 *   계정 열거 방지로 구분하지 않으니 FE도 구분해 안내하지 않는다(폼 상단)
 * - 400 BAD_REQUEST: message에서 위반 필드를 뽑아 그 입력에 귀속
 */
export function toPasswordAuthErrorView(error: unknown): PasswordAuthErrorView | null {
  if (error === null || error === undefined) return null;

  const message = error instanceof Error && error.message !== "" ? error.message : FALLBACK_MESSAGE;

  switch (getPasswordAuthErrorCode(error)) {
    case ERROR_CODES.DUPLICATE_RESOURCE:
      return { field: "loginId", message: "이미 사용 중인 아이디예요. 다른 아이디를 입력해 주세요." };
    case ERROR_CODES.LOGIN_FAILED:
      return { field: null, message };
    case ERROR_CODES.BAD_REQUEST:
      return parseFieldViolation(message);
    default:
      return { field: null, message: FALLBACK_MESSAGE };
  }
}
