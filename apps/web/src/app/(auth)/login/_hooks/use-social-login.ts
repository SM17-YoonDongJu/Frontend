"use client";

import { useCallback } from "react";
import { isAppWebViewUserAgent } from "@/shared/lib/app-webview-token";
import type { SocialProvider } from "../../_shared/hooks/use-recent-login";

const AUTHORIZE_ENDPOINT: Record<SocialProvider, string> = {
  kakao: "https://kauth.kakao.com/oauth/authorize",
  naver: "https://nid.naver.com/oauth2.0/authorize",
};

const CLIENT_ID: Record<SocialProvider, string | undefined> = {
  kakao: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID,
  naver: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
};

const OAUTH_STATE_KEY = "bb.oauthState";

function createState(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

/** 소셜 provider 인가 URL을 구성해 전체 페이지 리다이렉트로 로그인을 시작한다. */
export function useSocialLogin() {
  const startLogin = useCallback((provider: SocialProvider) => {
    if (typeof window === "undefined") return;

    // 앱 웹뷰 출발 표시 — 외부 브라우저로 우회된 콜백이 앱 복귀 딥링크로 바운스할 때 판별 근거.
    const state = isAppWebViewUserAgent(navigator.userAgent)
      ? `app.${createState()}`
      : createState();
    window.sessionStorage.setItem(`${OAUTH_STATE_KEY}.${provider}`, state);

    const params = new URLSearchParams({
      client_id: CLIENT_ID[provider] ?? "",
      redirect_uri: `${window.location.origin}/login/oauth2/code/${provider}`,
      response_type: "code",
      state,
    });

    window.location.href = `${AUTHORIZE_ENDPOINT[provider]}?${params.toString()}`;
  }, []);

  return { startLogin };
}
