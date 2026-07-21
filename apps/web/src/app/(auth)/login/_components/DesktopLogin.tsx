import Link from "next/link";
import { ShieldCheck } from "@/shared/ui/icons/ShieldCheck";
import { AuthHeader } from "../../_shared/ui/AuthHeader";
import type { RecentLogin, SocialProvider } from "../../_shared/hooks/use-recent-login";
import { LoginHero } from "./LoginHero";
import { RecentLoginCard } from "./RecentLoginCard";
import { SocialLoginButtons } from "./SocialLoginButtons";
import { TermsNotice } from "./TermsNotice";

interface DesktopLoginProps {
  mode: "first" | "returning";
  recentLogin: RecentLogin | null;
  onSelect: (provider: SocialProvider) => void;
  onRecentSelect: (provider: SocialProvider) => void;
  pendingProvider: SocialProvider | null;
}

export function DesktopLogin({
  mode,
  recentLogin,
  onSelect,
  onRecentSelect,
  pendingProvider,
}: DesktopLoginProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <AuthHeader
        right={
          mode === "returning" ? (
            <span className="flex items-center gap-2.5 text-[0.8125rem]">
              <span className="font-medium text-ink-3">처음이신가요?</span>
              <Link
                href="/signup"
                className="rounded-button border border-line px-[0.9375rem] py-[0.5625rem] font-semibold text-ink transition hover:bg-paper"
              >
                회원가입
              </Link>
            </span>
          ) : undefined
        }
      />

      <div className="flex flex-1 justify-center px-5 pt-[4.4375rem] pb-20">
        <div className="flex w-full max-w-[30rem] flex-col items-center gap-[1.125rem]">
          <LoginHero variant={mode} />

          <div className="flex w-full flex-col gap-5 rounded-card border border-line bg-card px-[1.8125rem] pt-[2.8125rem] pb-[1.8125rem] shadow-[0_1px_1px_rgba(21,32,46,0.03)]">
            <SocialLoginButtons mode={mode} onSelect={onSelect} pendingProvider={pendingProvider} />

            {mode === "returning" && recentLogin && (
              <>
                <div className="flex items-center gap-3">
                  <span className="h-[1px] flex-1 bg-line-2" />
                  <span className="text-[0.6875rem] tracking-[-0.01rem] text-ink-3">최근 로그인</span>
                  <span className="h-[1px] flex-1 bg-line-2" />
                </div>
                <RecentLoginCard recentLogin={recentLogin} onSelect={onRecentSelect} />
              </>
            )}

            {mode === "first" && <TermsNotice />}
          </div>

          {mode === "first" && (
            <div className="flex w-full items-center gap-2.5 rounded-input bg-gold-soft px-4 py-3.5">
              <ShieldCheck className="size-[1.0625rem] shrink-0 text-gold-ink" />
              <p className="text-[0.75rem] tracking-[-0.01rem] text-gold-ink">
                본인 인증과 약관 동의는 가입 직후 단계에서 진행됩니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
