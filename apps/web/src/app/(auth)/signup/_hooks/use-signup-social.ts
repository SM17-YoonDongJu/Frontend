"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { getSignupTicket } from "../../_shared/lib/signup-ticket";
import type { RegisterBody } from "../_model/register.schema";

/**
 * 소셜 인증 컨텍스트 획득. OAuth 콜백(#40)이 보관한 signupTicket(sessionStorage)을
 * register의 socialToken으로 사용한다. URL 쿼리는 개발·E2E 주입 경로로 유지.
 * 둘 다 없으면 null — 페이지가 /login으로 가드한다.
 */
export interface SignupSocialContext {
  provider: RegisterBody["provider"];
  socialToken: string;
  /** 닉네임 기본값·완료 화면 표시 */
  nickname: string;
  /** 완료 화면 표시·register email 후보 */
  email?: string;
}

// nickname = 사용자 이름(소셜 프로필 표시명). 콜백 응답에 프로필이 없어 임시 기본값.
// TODO: 백엔드가 register 시 signupTicket에서 이름을 추출하는지 확인 후 교체(그렇다면 이 필드 전송 제거).
const DEFAULT_NICKNAME = "바른보상 회원";

function toProvider(value: string | null): RegisterBody["provider"] {
  return value === "naver" ? "naver" : "kakao";
}

export function useSignupSocial(): SignupSocialContext | null {
  const searchParams = useSearchParams();
  // 가입 성공 시 티켓이 지워져도 완료 화면이 유지되도록 최초 렌더 값을 고정한다.
  const [stored] = useState(getSignupTicket);

  const queryToken = searchParams.get("socialToken");
  if (queryToken) {
    return {
      provider: toProvider(searchParams.get("provider")),
      socialToken: queryToken,
      nickname: searchParams.get("nickname") ?? DEFAULT_NICKNAME,
      email: searchParams.get("email") ?? undefined,
    };
  }

  if (stored) {
    return {
      provider: stored.provider,
      socialToken: stored.ticket,
      nickname: DEFAULT_NICKNAME,
    };
  }

  return null;
}
