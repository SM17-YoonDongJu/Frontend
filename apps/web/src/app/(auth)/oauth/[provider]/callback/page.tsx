"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { getMe } from "@/shared/api/get-me";
import { setTokens } from "@/shared/auth/token-storage";
import { Button } from "@/shared/ui/Button";
import { maskEmail } from "../../../_shared/lib/mask-email";
import { Spinner } from "@/shared/ui/icons/Spinner";
import { AlertTriangle } from "@/shared/ui/icons/AlertTriangle";
import {
  useRecentLogin,
  type RecentLogin,
} from "../../../_shared/hooks/use-recent-login";
import { useOauthCallback } from "./_api/use-oauth-callback";

const SUPPORTED_PROVIDERS = ["kakao", "naver"] as const;
type SupportedProvider = (typeof SUPPORTED_PROVIDERS)[number];

function isSupportedProvider(value: string): value is SupportedProvider {
  return (SUPPORTED_PROVIDERS as readonly string[]).includes(value);
}

const ERROR_MESSAGE: Record<string, string> = {
  EXTERNAL_API_ERROR: "소셜 로그인 연동 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요.",
  INVALID_REQUEST: "로그인 요청이 만료되었어요. 다시 시도해 주세요.",
  UNSUPPORTED_OPERATION: "지원하지 않는 소셜 로그인 방식이에요. 다시 시도해 주세요.",
};

function CenteredMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
      {children}
    </div>
  );
}

export default function OauthCallbackPage() {
  const router = useRouter();
  const params = useParams<{ provider: string }>();
  const searchParams = useSearchParams();
  const { saveRecentLogin } = useRecentLogin();
  const handledRef = useRef(false);

  const provider = params.provider;
  const code = searchParams.get("code");
  const oauthError = searchParams.get("error");
  const state = searchParams.get("state");

  const invalidEntry = !code || !!oauthError || !isSupportedProvider(provider);

  useEffect(() => {
    if (invalidEntry) router.replace("/login");
  }, [invalidEntry, router]);

  const { data, isError, error, refetch, isFetching } = useOauthCallback({
    provider,
    code,
    state,
  });

  useEffect(() => {
    if (!data || handledRef.current || !isSupportedProvider(provider)) return;
    handledRef.current = true;

    setTokens(data.accessToken, data.refreshToken);

    void (async () => {
      let maskedEmail = "";
      try {
        const me = await getMe();
        if (me.email) maskedEmail = maskEmail(me.email);
      } catch {
        // 프로필 조회 실패는 로그인을 막지 않는다 — 흔적은 계정 라벨 없이 기록.
      }

      const recent: RecentLogin = {
        provider,
        maskedEmail,
        lastLoginAt: new Date().toISOString(),
      };
      saveRecentLogin(recent);

      router.replace(data.isNewUser ? "/signup" : "/");
    })();
  }, [data, provider, router, saveRecentLogin]);

  if (invalidEntry) return null;

  if (isError) {
    const message = ERROR_MESSAGE[error?.name ?? ""] ?? "로그인을 완료하지 못했어요. 다시 시도해 주세요.";
    return (
      <CenteredMessage>
        <span
          aria-hidden
          className="flex size-12 items-center justify-center rounded-full bg-terra-soft text-[1.75rem] text-terra"
        >
          <AlertTriangle className="size-6" />
        </span>
        <p className="text-sm leading-6 text-ink-2">{message}</p>
        <div className="flex w-full flex-col gap-2.5">
          <Button full loading={isFetching} onClick={() => refetch()}>
            다시 시도
          </Button>
          <Button full variant="ghost" onClick={() => router.replace("/login")}>
            로그인으로 돌아가기
          </Button>
        </div>
      </CenteredMessage>
    );
  }

  return (
    <CenteredMessage>
      <span aria-hidden className="text-[2rem] text-ink-3">
        <Spinner />
      </span>
      <p className="text-sm text-ink-3">로그인 중이에요…</p>
    </CenteredMessage>
  );
}
