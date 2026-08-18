const CONSUMED_CODE_KEY = "bb.oauthConsumedCode";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/**
 * 카카오/네이버 인가코드는 1회용 — 콜백 페이지가 리마운트돼도(gcTime 만료 후 재요청 등)
 * 이미 성공 처리한 code로는 다시 호출하지 않도록 세션 단위로 기억한다.
 */
export function isCodeConsumed(provider: string, code: string): boolean {
  if (!isBrowser()) return false;
  try {
    return window.sessionStorage.getItem(CONSUMED_CODE_KEY) === `${provider}:${code}`;
  } catch {
    return false;
  }
}

export function markCodeConsumed(provider: string, code: string): void {
  if (!isBrowser()) return;
  try {
    window.sessionStorage.setItem(CONSUMED_CODE_KEY, `${provider}:${code}`);
  } catch {}
}
