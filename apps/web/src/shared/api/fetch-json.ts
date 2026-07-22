import type { ZodType } from "zod";
import {
  camelToSnakeDeep,
  snakeToCamelDeep,
} from "@/shared/api/case-convert";
import {
  ERROR_CODES,
  getErrorCode,
  isAuthRedirectError,
} from "@/shared/api/error-codes";
import { reissueTokens } from "@/shared/api/reissue";
import { saveReturnPath } from "@/shared/lib/return-path";

const LOGIN_REQUIRED_PATH = "/login-required";

interface ResponseEnvelope {
  status?: string;
  code?: string;
  message?: string;
  data?: unknown;
}

export interface FetchJsonInit extends RequestInit {
  /** 재발급 자신(`/auth/reissue`)처럼 401 시 재발급·재시도를 타면 안 되는 요청. */
  skipTokenReissue?: boolean;
  /** 인증 상태 프로브(getMe)처럼 인증 에러를 호출부가 해석해야 해서 로그인 안내 이동을 타면 안 되는 요청. */
  skipAuthRedirect?: boolean;
}

function isEnvelope(value: unknown): value is ResponseEnvelope {
  return typeof value === "object" && value !== null;
}

async function requestJson<T>(
  url: string,
  schema: ZodType<T>,
  init: RequestInit,
): Promise<T> {
  const res = await fetch(url, { ...init, credentials: "include" });
  const json: unknown = await res.json().catch(() => null);

  if (!res.ok || (isEnvelope(json) && json.code)) {
    const err = new Error(
      (isEnvelope(json) && json.message) || "요청을 처리하지 못했습니다.",
    );
    err.name = (isEnvelope(json) && json.code) || `HTTP_${res.status}`;
    throw err;
  }

  return schema.parse(snakeToCamelDeep(isEnvelope(json) ? json.data : json));
}

function redirectToLoginRequired(): void {
  if (typeof window === "undefined") return;
  if (window.location.pathname === LOGIN_REQUIRED_PATH) return;
  saveReturnPath(window.location.pathname + window.location.search);
  window.location.replace(LOGIN_REQUIRED_PATH);
}

/**
 * 공용 fetch — 응답 봉투({ code?, message?, data }) 해제 + zod 검증.
 * 실패(HTTP 에러 또는 code 존재) 시 throw, err.name엔 서버 code(없으면 HTTP_<status>).
 * EXPIRED_TOKEN이면 재발급 후 1회만 재시도하고, 재발급 실패·그 외 인증 에러는
 * 복귀 경로를 저장한 뒤 /login-required 안내 화면으로 이동한다.
 */
export async function fetchJson<T>(
  url: string,
  schema: ZodType<T>,
  init?: FetchJsonInit,
): Promise<T> {
  const {
    skipTokenReissue = false,
    skipAuthRedirect = false,
    ...requestInit
  } = init ?? {};

  // JSON body만 snake_case로 변환 — FormData·비JSON 문자열은 그대로 보낸다.
  if (typeof requestInit.body === "string") {
    try {
      requestInit.body = JSON.stringify(
        camelToSnakeDeep(JSON.parse(requestInit.body)),
      );
    } catch {
      // JSON이 아닌 문자열 body는 변환하지 않는다
    }
  }

  try {
    return await requestJson(url, schema, requestInit);
  } catch (error) {
    if (skipTokenReissue || getErrorCode(error) !== ERROR_CODES.EXPIRED_TOKEN) {
      if (!skipAuthRedirect && isAuthRedirectError(error)) {
        redirectToLoginRequired();
      }
      throw error;
    }

    const reissued = await reissueTokens();
    if (!reissued) {
      if (!skipAuthRedirect) redirectToLoginRequired();
      throw error;
    }

    return await requestJson(url, schema, requestInit);
  }
}
