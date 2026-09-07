import { http, HttpResponse } from "msw";
import { camelToSnakeDeep } from "@/shared/api/case-convert";

/**
 * 목 응답을 실제 와이어 모양(snake_case)으로 내보내는 경계.
 *
 * 목 데이터는 읽기 편하게 camelCase로 쓰고 나가는 지점에서만 바꾼다. 이 경계가 없으면
 * 목이 서버와 다른 계약을 흉내내고, client의 snakeToCamelDeep이 camel 키를 그대로
 * 통과시키는 탓에 E2E가 그 차이를 잡지 못한다(로컬은 통과, 실서버는 undefined).
 *
 * 응답 래퍼의 data만 바꾼다 — status·message·code는 서버도 그대로 내려준다.
 */
/**
 * 스펙이 camelCase로 선언한 필드 — 백엔드가 이 자리에만 이름을 명시한 것으로 보인다.
 * 전역 snake 변환이 이들까지 바꾸면 실서버와 다른 모양이 되므로 되돌린다.
 */
const SPEC_CAMEL_KEYS: Record<string, string> = {
  issue_id: "issueId",
  issue_count: "issueCount",
  issued_by: "issuedBy",
  issued_at: "issuedAt",
};

function restoreSpecCamelKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(restoreSpecCamelKeys);
  if (value === null || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, child]) => [
      SPEC_CAMEL_KEYS[key] ?? key,
      restoreSpecCamelKeys(child),
    ]),
  );
}

function toWireResponse<Args extends unknown[]>(
  resolver: (...args: Args) => unknown,
): (...args: Args) => Promise<unknown> {
  return async (...args: Args) => {
    const result = await resolver(...args);
    if (!(result instanceof Response)) return result;
    if (!result.headers.get("content-type")?.includes("application/json")) return result;

    const body: unknown = await result
      .clone()
      .json()
      .catch(() => null);
    if (body === null || typeof body !== "object" || !("data" in body)) return result;

    const envelope = body as Record<string, unknown>;
    // 원본 Content-Length는 변환 전 본문 기준이라 그대로 넘기면 새 본문과 어긋난다.
    // HttpResponse.json은 넘겨받은 값이 있으면 다시 계산하지 않으므로 지워서 넘긴다.
    const headers = new Headers(result.headers);
    headers.delete("content-length");

    return HttpResponse.json(
      { ...envelope, data: restoreSpecCamelKeys(camelToSnakeDeep(envelope.data)) },
      { status: result.status, headers },
    );
  };
}

function wrapMethod<Method extends typeof http.get>(method: Method): Method {
  return ((path: never, resolver: never, options: never) =>
    method(path, toWireResponse(resolver) as never, options)) as Method;
}

/** msw http 대체 — 핸들러가 돌려준 응답을 와이어 모양으로 바꿔 내보낸다. */
export const wire = {
  get: wrapMethod(http.get),
  post: wrapMethod(http.post),
  patch: wrapMethod(http.patch),
  put: wrapMethod(http.put),
  delete: wrapMethod(http.delete),
};
