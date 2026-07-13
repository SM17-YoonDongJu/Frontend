const SIGNUP_TICKET_KEY = "bb.signupTicket";

export interface SignupTicket {
  ticket: string;
  provider: "kakao" | "naver";
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/**
 * 신규 회원 가입용 signupTicket 임시 보관. register(POST /auth/register)가
 * socialToken으로 소비. 퍼널이 다단계(약관 상세 왕복 포함)라 읽기는 비파괴,
 * 제거는 가입 성공 시 clear로만. sessionStorage 실패(사생활 모드·quota)는 조용히 무시.
 */
export function saveSignupTicket(ticket: string, provider: SignupTicket["provider"]): void {
  if (!isBrowser()) return;
  try {
    window.sessionStorage.setItem(SIGNUP_TICKET_KEY, JSON.stringify({ ticket, provider }));
  } catch {}
}

export function getSignupTicket(): SignupTicket | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.sessionStorage.getItem(SIGNUP_TICKET_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      typeof (parsed as SignupTicket).ticket !== "string" ||
      ((parsed as SignupTicket).provider !== "kakao" && (parsed as SignupTicket).provider !== "naver")
    ) {
      return null;
    }
    return parsed as SignupTicket;
  } catch {
    return null;
  }
}

export function clearSignupTicket(): void {
  if (!isBrowser()) return;
  try {
    window.sessionStorage.removeItem(SIGNUP_TICKET_KEY);
  } catch {}
}
