import type { ZodType } from "zod";

interface ResponseEnvelope {
  status?: string;
  code?: string;
  message?: string;
  data?: unknown;
}

function isEnvelope(value: unknown): value is ResponseEnvelope {
  return typeof value === "object" && value !== null;
}

/**
 * 공용 fetch — 응답 봉투({ code?, message?, data }) 해제 + zod 검증.
 * 실패(HTTP 에러 또는 code 존재) 시 throw, err.name엔 서버 code(없으면 HTTP_<status>).
 * 비-JSON 본문도 throw 없이 흡수(null 처리).
 */
export async function fetchJson<T>(
  url: string,
  schema: ZodType<T>,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(url, init);
  const json: unknown = await res.json().catch(() => null);

  if (!res.ok || (isEnvelope(json) && json.code)) {
    const err = new Error(
      (isEnvelope(json) && json.message) || "요청을 처리하지 못했습니다.",
    );
    err.name = (isEnvelope(json) && json.code) || `HTTP_${res.status}`;
    throw err;
  }

  return schema.parse(isEnvelope(json) ? json.data : json);
}
