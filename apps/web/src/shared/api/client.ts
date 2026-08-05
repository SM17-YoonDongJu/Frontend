import { client } from "@/shared/api/generated/client.gen";
import { API_BASE_URL } from "@/shared/api/config";
import { camelToSnakeDeep, snakeToCamelDeep } from "@/shared/api/case-convert";
import { ERROR_CODES, isAuthRedirectError } from "@/shared/api/error-codes";
import { saveReturnPath } from "@/shared/lib/return-path";

// hey-api의 ClientMeta 확장 포인트 — 호출별 skipTokenReissue/skipAuthRedirect를 options.meta로 전달.
declare module "@/shared/api/generated/core/types.gen" {
  interface ClientMeta {
    skipTokenReissue?: boolean;
    skipAuthRedirect?: boolean;
  }
}

const LOGIN_REQUIRED_PATH = "/login-required";
const SKIP_REISSUE_HEADER = "x-skip-token-reissue";
const SKIP_REDIRECT_HEADER = "x-skip-auth-redirect";

interface ResponseEnvelope {
  status?: string;
  code?: string;
  message?: string;
  data?: unknown;
}

function isEnvelope(value: unknown): value is ResponseEnvelope {
  return typeof value === "object" && value !== null;
}

function redirectToLoginRequired(): void {
  if (typeof window === "undefined") return;
  if (window.location.pathname === LOGIN_REQUIRED_PATH) return;
  saveReturnPath(window.location.pathname + window.location.search);
  window.location.replace(LOGIN_REQUIRED_PATH);
}

let inFlightReissue: Promise<boolean> | null = null;

/** /auth/reissue 자체는 client를 거치지 않고 순수 fetch로 호출한다 — 재귀(재발급 요청이 또 재발급을 트리거) 방지. */
async function requestReissue(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/reissue`, {
      method: "POST",
      credentials: "include",
    });
    const json: unknown = await res.json().catch(() => null);
    return res.ok && !(isEnvelope(json) && json.code);
  } catch {
    return false;
  }
}

/** 동시 401이 refresh_token(RTR)을 중복 소모하지 않도록 진행 중인 재발급 promise를 공유한다. */
function reissueOnce(): Promise<boolean> {
  inFlightReissue ??= requestReissue().finally(() => {
    inFlightReissue = null;
  });
  return inFlightReissue;
}

async function parseErrorCode(response: Response): Promise<string | null> {
  const json: unknown = await response
    .clone()
    .json()
    .catch(() => null);
  return isEnvelope(json) ? (json.code ?? null) : null;
}

/**
 * fetchJson의 401 재발급 1회 재시도 로직을 client-fetch용 커스텀 fetch로 이관.
 * skipTokenReissue/skipAuthRedirect는 request 인터셉터가 심어둔 헤더로 전달받는다
 * (커스텀 fetch는 Request 객체만 받고 호출별 options.meta에 접근할 수 없음).
 */
function createRetryingFetch(): typeof fetch {
  return async (input) => {
    const request = input as Request;
    const skipTokenReissue = request.headers.has(SKIP_REISSUE_HEADER);
    const skipAuthRedirect = request.headers.has(SKIP_REDIRECT_HEADER);
    request.headers.delete(SKIP_REISSUE_HEADER);
    request.headers.delete(SKIP_REDIRECT_HEADER);

    // 재시도 대비 복사본은 원본 전송 전에 미리 떠둔다(전송 후엔 body가 소비돼 clone 불가).
    // 원본은 그대로 fetch에 넘긴다 — clone된 Request를 보내면 브라우저 네트워크 캡처(Playwright
    // postData 등)가 body를 못 읽는 경우가 있어(#adjuster-review E2E로 확인) 첫 시도는 원본 그대로 보낸다.
    const retryCopy = request.clone();
    const res = await fetch(request);
    if (res.status !== 401) return res;

    const code = await parseErrorCode(res);
    if (skipTokenReissue || code !== ERROR_CODES.EXPIRED_TOKEN) return res;

    const reissued = await reissueOnce();
    if (!reissued) {
      if (!skipAuthRedirect) redirectToLoginRequired();
      return res;
    }

    const retryRes = await fetch(retryCopy);
    if (retryRes.status === 401) {
      const retryCode = await parseErrorCode(retryRes);
      if (!skipAuthRedirect && retryCode === ERROR_CODES.EXPIRED_TOKEN) {
        redirectToLoginRequired();
      }
    }
    return retryRes;
  };
}

client.setConfig({
  baseUrl: API_BASE_URL,
  fetch: createRetryingFetch(),
  credentials: "include",
  bodySerializer: (body: unknown) => JSON.stringify(camelToSnakeDeep(body)),
  // 봉투({status,message,data}) 해제 + snake_case → camelCase. code 있는 200 응답도 실패로 취급.
  responseTransformer: async (raw: unknown) => {
    if (isEnvelope(raw) && raw.code) {
      const err = new Error(raw.message ?? "요청을 처리하지 못했습니다.");
      err.name = raw.code;
      throw err;
    }
    const data = isEnvelope(raw) && "data" in raw ? raw.data : raw;
    return snakeToCamelDeep(data);
  },
});

// meta는 SDK 레벨 Options 타입에만 선언돼 있고 인터셉터의 ResolvedRequestOptions엔 없지만,
// 런타임에는 호출 시 넘긴 options가 그대로 병합돼 전달된다.
interface RequestMeta {
  skipTokenReissue?: boolean;
  skipAuthRedirect?: boolean;
}

client.interceptors.request.use((request, options) => {
  const meta = (options as { meta?: RequestMeta }).meta;
  if (meta?.skipTokenReissue) request.headers.set(SKIP_REISSUE_HEADER, "1");
  if (meta?.skipAuthRedirect) request.headers.set(SKIP_REDIRECT_HEADER, "1");
  return request;
});

client.interceptors.error.use((rawError, _response, _request, options) => {
  const meta = (options as { meta?: RequestMeta }).meta;
  const code = isEnvelope(rawError) ? rawError.code : undefined;
  const message = isEnvelope(rawError) ? rawError.message : undefined;
  const err = new Error(message ?? "요청을 처리하지 못했습니다.");
  err.name = code ?? "Error";

  if (!meta?.skipAuthRedirect && isAuthRedirectError(err)) {
    redirectToLoginRequired();
  }
  return err;
});

export { client };
