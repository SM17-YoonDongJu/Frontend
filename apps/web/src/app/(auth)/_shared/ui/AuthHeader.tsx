import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import { AuthBrandMark } from "./AuthBrandMark";

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
