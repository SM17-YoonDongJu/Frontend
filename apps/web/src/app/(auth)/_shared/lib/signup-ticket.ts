const SIGNUP_TICKET_KEY = "bb.signupTicket";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/**
 * 신규 회원 가입용 signupTicket 임시 보관. register(POST /auth/register)가
 * socialToken으로 소비. sessionStorage 실패(사생활 모드·quota)는 조용히 무시.
 */
export function saveSignupTicket(ticket: string): void {
  if (!isBrowser()) return;
  try {
    window.sessionStorage.setItem(SIGNUP_TICKET_KEY, ticket);
  } catch {}
}

export function takeSignupTicket(): string | null {
  if (!isBrowser()) return null;
  try {
    const ticket = window.sessionStorage.getItem(SIGNUP_TICKET_KEY);
    window.sessionStorage.removeItem(SIGNUP_TICKET_KEY);
    return ticket;
  } catch {
    return null;
  }
}
