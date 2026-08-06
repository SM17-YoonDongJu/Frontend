"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getMe } from "@/shared/api/get-me";
import {
  APP_DEEP_LINK_SCHEME,
  isAppWebViewUserAgent,
} from "@/shared/lib/app-webview-token";
import { Button } from "@/shared/ui/Button";
import { maskEmail } from "../../../../_shared/lib/mask-email";
import { saveSignupTicket } from "../../../../_shared/lib/signup-ticket";
import { Spinner } from "@/shared/ui/icons/Spinner";
import { AlertTriangle } from "@/shared/ui/icons/AlertTriangle";
import {
  useRecentLogin,
  type RecentLogin,
} from "../../../../_shared/hooks/use-recent-login";
import { useOauthCallback } from "./_api/use-oauth-callback";
import { CenteredMessage } from "./_components/CenteredMessage";
import { oauthProviderSchema, type OauthProvider } from "./_model/oauth-callback.schema";

function isSupportedProvider(value: string): value is OauthProvider {
  return oauthProviderSchema.safeParse(value).success;
}

const ERROR_MESSAGE: Record<string, string> = {
  EXTERNAL_API_ERROR: "소셜 로그인 연동 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요.",
  INVALID_REQUEST: "로그인 요청이 만료되었어요. 다시 시도해 주세요.",
  UNSUPPORTED_PROVIDER: "지원하지 않는 소셜 로그인 방식이에요. 다시 시도해 주세요.",
};

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

  // 앱 웹뷰에서 시작해 외부 브라우저로 우회된 로그인 복귀 — 여기서 code를 교환하면
  // 쿠키가 외부 브라우저에 남으므로, 교환 없이 앱 딥링크로 code를 넘긴다.
  const [isAppReturnInExternalBrowser] = useState(
    () =>
      typeof navigator !== "undefined" &&
      !!state?.startsWith("app.") &&
      !isAppWebViewUserAgent(navigator.userAgent),
  );

  const invalidEntry = !code || !!oauthError || !isSupportedProvider(provider);
  // 거부·오류·미지원 provider 콜백은 외부 브라우저여도 /login으로 — 빈 화면 방지.
  const isExternalBrowserReturn = isAppReturnInExternalBrowser && !invalidEntry;

  useEffect(() => {
    if (invalidEntry) router.replace("/login");
  }, [invalidEntry, router]);

  useEffect(() => {
    if (!isExternalBrowserReturn || !code) return;
    const query = new URLSearchParams({ code });
    if (state) query.set("state", state);
    window.location.replace(
      `${APP_DEEP_LINK_SCHEME}://login/oauth2/code/${provider}?${query.toString()}`,
    );
  }, [isExternalBrowserReturn, code, state, provider]);

  const { data, isError, error, refetch, isFetching } = useOauthCallback({
    provider,
    code: isExternalBrowserReturn ? null : code,
    state,
  });

  useEffect(() => {
    if (!data || handledRef.current || !isSupportedProvider(provider)) return;
    handledRef.current = true;

    // 신규 회원은 쿠키가 없어(getMe 시 401) 티켓만 보관하고 가입으로 이동한다.
    if (data.isNewUser) {
      if (data.signupTicket) saveSignupTicket(data.signupTicket, provider);
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
