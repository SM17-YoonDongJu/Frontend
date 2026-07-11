"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { getMe } from "@/shared/api/get-me";
import { Button } from "@/shared/ui/Button";
import { maskEmail } from "../../../_shared/lib/mask-email";
import { saveSignupTicket } from "../../../_shared/lib/signup-ticket";
import { Spinner } from "@/shared/ui/icons/Spinner";
import { AlertTriangle } from "@/shared/ui/icons/AlertTriangle";
import {
  useRecentLogin,
  type RecentLogin,
} from "../../../_shared/hooks/use-recent-login";
import { useOauthCallback } from "./_api/use-oauth-callback";
import { oauthProviderSchema, type OauthProvider } from "./_model/oauth-callback.schema";

function isSupportedProvider(value: string): value is OauthProvider {
  return oauthProviderSchema.safeParse(value).success;
}

const ERROR_MESSAGE: Record<string, string> = {
  EXTERNAL_API_ERROR: "소셜 로그인 연동 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요.",
  INVALID_REQUEST: "로그인 요청이 만료되었어요. 다시 시도해 주세요.",
  UNSUPPORTED_PROVIDER: "지원하지 않는 소셜 로그인 방식이에요. 다시 시도해 주세요.",
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

    // 신규 회원은 쿠키가 없어(getMe 시 401) 티켓만 보관하고 가입으로 이동한다.
    if (data.isNewUser) {
      if (data.signupTicket) saveSignupTicket(data.signupTicket);
      router.replace("/signup");
      return;
    }

    void (async () => {
      // 프로필 조회·스토리지 실패(사생활 모드·quota 초과)가 나도 로그인 이동은 항상 진행한다.
      try {
        let maskedEmail = "";
        try {
          const me = await getMe();
          if (me.email) maskedEmail = maskEmail(me.email);
        } catch {}

        const recent: RecentLogin = {
          provider,
          maskedEmail,
          lastLoginAt: new Date().toISOString(),
        };
        saveRecentLogin(recent);
      } catch {}

      router.replace("/");
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
