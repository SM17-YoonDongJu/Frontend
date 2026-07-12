import type { SocialProvider } from "./types";

const SOCIAL_LABEL: Record<SocialProvider, string> = {
  kakao: "카카오",
  naver: "네이버",
};

/** 소셜 계정 표시 라벨(예: "카카오 계정"). provider 없으면 "소셜 계정". */
export function socialAccountLabel(provider: SocialProvider | null): string {
  if (!provider) return "소셜 계정";
  return `${SOCIAL_LABEL[provider]} 계정`;
}

/** 가입 경로 문구(예: "카카오 계정으로 가입 · 2026.05"). */
export function joinInfoLabel(
  provider: SocialProvider | null,
  createdAt: string,
): string {
  const date = new Date(createdAt);
  const yearMonth = Number.isNaN(date.getTime())
    ? ""
    : `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}`;
  return `${socialAccountLabel(provider)}으로 가입 · ${yearMonth}`;
}
