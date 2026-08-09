import Link from "next/link";
import { Scale } from "@/shared/ui/icons/Scale";
import { ShieldCheck } from "@/shared/ui/icons/ShieldCheck";
import type { SocialProvider } from "../../_shared/hooks/use-recent-login";
import { SocialLoginButtons } from "./SocialLoginButtons";

interface MobileLoginProps {
  mode: "first" | "returning";
  onSelect: (provider: SocialProvider) => void;
  pendingProvider: SocialProvider | null;
}

const MOBILE_COPY = {
  first: {
    titleLines: ["바른보상", "시작하기"],
    subtitleLines: ["받은 보험금이 적정한지,", "전화 없이 확인해요."],
  },
  returning: {
    titleLines: ["다시 오신 걸", "환영해요"],
    subtitleLines: ["소셜 계정으로 간편하게 시작하세요.", "가입과 로그인이 한 번에 진행돼요."],
  },
} as const;

export function MobileLogin({ mode, onSelect, pendingProvider }: MobileLoginProps) {
  const { titleLines, subtitleLines } = MOBILE_COPY[mode];

  return (
    <div className="flex min-h-dvh flex-col bg-paper px-7 pt-13 pb-10">
      <div className="flex items-center gap-[0.5625rem]">
        <span className="flex size-[1.875rem] items-center justify-center rounded-lg bg-gold text-white">
          <Scale className="size-[1.1875rem]" />
        </span>
        <span className="font-serif text-[1.24rem] font-bold tracking-[-0.025rem] text-ink">바른보상</span>
      </div>

      <h1 className="mt-10 font-serif text-[1.875rem] font-bold leading-[2.34rem] tracking-[-0.01rem] text-ink">
        {titleLines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h1>

      <p className="mt-2 mb-9 text-[0.84rem] leading-relaxed tracking-[-0.01rem] text-ink-3">
        {subtitleLines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>

      <SocialLoginButtons mode={mode} onSelect={onSelect} pendingProvider={pendingProvider} layout="mobile" />

      <div className="mt-6 flex items-center gap-[0.5625rem] rounded-xl bg-gold-soft px-4 py-3.5">
        <ShieldCheck className="size-[1.0625rem] shrink-0 text-gold-ink" />
        <p className="text-[0.73rem] leading-[1.21rem] tracking-[-0.01rem] text-gold-ink">
          소셜 로그인으로만 가입합니다. 별도 비밀번호를 만들 필요가 없어요.
        </p>
      </div>

      <p className="mt-6 text-center text-[0.71rem] leading-5 tracking-[-0.01rem] text-ink-3">
        계속 진행하면{" "}
        <Link href="/terms" className="font-semibold text-ink-2 underline underline-offset-2">
          서비스 이용약관
        </Link>
        과{" "}
        <Link href="/privacy" className="font-semibold text-ink-2 underline underline-offset-2">
          개인정보 처리방침
        </Link>
        에 동의하는 것으로 간주됩니다.
      </p>
    </div>
  );
}
