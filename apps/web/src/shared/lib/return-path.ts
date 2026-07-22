const RETURN_PATH_KEY = "bb.returnPath";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/** 내부 경로만 허용 — 절대 URL·프로토콜 상대(`//`) 값은 open redirect라 버린다. */
function isSafeInternalPath(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//");
}

/**
 * 로그인 완료 후 복귀할 경로 임시 보관. 인증 에러로 로그인 안내 화면에 보내기 직전 저장하고,
 * 로그인 성공 시 consume으로 1회 소비한다. 소셜 로그인이 풀페이지 리다이렉트라 쿼리 대신
 * sessionStorage를 쓴다. 저장 실패(사생활 모드·quota)는 조용히 무시.
 */
export function saveReturnPath(path: string): void {
  if (!isBrowser() || !isSafeInternalPath(path)) return;
  try {
    window.sessionStorage.setItem(RETURN_PATH_KEY, path);
  } catch {}
}

export function consumeReturnPath(): string | null {
  if (!isBrowser()) return null;
  try {
    const path = window.sessionStorage.getItem(RETURN_PATH_KEY);
    window.sessionStorage.removeItem(RETURN_PATH_KEY);
    if (!path || !isSafeInternalPath(path)) return null;
    return path;
  } catch {
    return null;
  }
}
