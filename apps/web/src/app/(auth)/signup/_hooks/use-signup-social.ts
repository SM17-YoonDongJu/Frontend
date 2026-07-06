"use client";

import { useSearchParams } from "next/navigation";
import type { RegisterBody } from "../_model/register.schema";

/**
 * 소셜 인증 컨텍스트 획득. 기능6 "소셜 인증 후 진입".
 * MVP: 진입 쿼리스트링에서 읽고, 없으면 개발용 mock 기본값 사용.
 * TODO: 로그인/OAuth 콜백 이슈 확정 후 실제 전달 경로(세션/쿠키)로 교체.
 */
export interface SignupSocialContext {
  provider: RegisterBody["provider"];
  socialToken: string;
  /** 소셜 프로필에서 넘어온 표시 이름(닉네임 기본값·완료 화면 표시) */
  nickname: string;
  /** 소셜 프로필 이메일(완료 화면 표시·register email 후보) */
  email?: string;
}

const MOCK_SOCIAL: SignupSocialContext = {
  provider: "kakao",
  socialToken: "mock-social-token",
  nickname: "윤서",
  email: "yunseo@email.com",
};

function toProvider(value: string | null): RegisterBody["provider"] {
  return value === "naver" ? "naver" : "kakao";
}

export function useSignupSocial(): SignupSocialContext {
  const searchParams = useSearchParams();
  const socialToken = searchParams.get("socialToken");

  if (!socialToken) return MOCK_SOCIAL;

  return {
    provider: toProvider(searchParams.get("provider")),
    socialToken,
    nickname: searchParams.get("nickname") ?? MOCK_SOCIAL.nickname,
    email: searchParams.get("email") ?? undefined,
  };
}
