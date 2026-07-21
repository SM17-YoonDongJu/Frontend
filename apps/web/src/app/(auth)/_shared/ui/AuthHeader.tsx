import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import { Scale } from "@/shared/ui/icons/Scale";

export function AuthBrandMark() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex size-[1.875rem] items-center justify-center rounded-lg bg-gold text-white">
        <Scale className="size-[1.1875rem]" />
      </span>
      <span className="font-serif text-[1.25rem] font-bold tracking-[-0.025rem] text-ink">바른보상</span>
    </span>
  );
}

interface AuthHeaderProps {
  /** 우측 슬롯(로그인·회원가입 안내 등, 없으면 로고만) */
  right?: ReactNode;
  className?: string;
}

/** (auth) PC 상단 헤더: 브랜드 로고 + 우측 슬롯. */
export function AuthHeader({ right, className }: AuthHeaderProps) {
  return (
    <header
      className={cn(
        "flex w-full items-center justify-between border-b border-line-2 bg-card px-14 pt-5 pb-[1.3125rem]",
        className,
      )}
    >
      <AuthBrandMark />
      {right}
    </header>
  );
}
