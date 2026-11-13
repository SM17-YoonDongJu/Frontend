import { UNKNOWN_ENUM_VALUE } from "@/shared/lib/enum-with-fallback";
import type { Me, SocialProvider } from "./types";

const SOCIAL_LABEL: Record<SocialProvider, string> = {
  kakao: "카카오",
  naver: "네이버",
  apple: "애플",
};

/**
 * 가입 계정 표시 라벨(예: "카카오 계정").
 * socialProvider가 null이면 아이디·비밀번호로 가입한 계정이다(#322) — 소셜 연결 표시를 쓰지 않는다.
 * 모르는 provider가 온 경우만 "소셜 계정"으로 뭉갠다.
 */
export function socialAccountLabel(provider: Me["socialProvider"]): string {
  if (!provider) return "아이디";
  if (provider === UNKNOWN_ENUM_VALUE) return "소셜 계정";
  return `${SOCIAL_LABEL[provider]} 계정`;
}

const HANGUL_BASE = 0xac00;
const HANGUL_LAST = 0xd7a3;
const JONGSEONG_COUNT = 28;

/** 받침 유무로 "으로"/"로"를 고른다 — "카카오 계정으로"와 "아이디로"가 같은 템플릿을 타기 때문. */
function withRo(word: string): string {
  const code = word.codePointAt(word.length - 1) ?? 0;
  const hasJongseong =
    code >= HANGUL_BASE && code <= HANGUL_LAST && (code - HANGUL_BASE) % JONGSEONG_COUNT !== 0;
  return `${word}${hasJongseong ? "으로" : "로"}`;
}

/** 가입 경로 문구(예: "카카오 계정으로 가입 · 2026.05", 일반 가입은 "아이디로 가입 · 2026.05"). */
export function joinInfoLabel(
  provider: Me["socialProvider"],
  createdAt: string,
): string {
  const date = new Date(createdAt);
  const label = `${withRo(socialAccountLabel(provider))} 가입`;
  if (Number.isNaN(date.getTime())) return label;
  const yearMonth = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}`;
  return `${label} · ${yearMonth}`;
}
