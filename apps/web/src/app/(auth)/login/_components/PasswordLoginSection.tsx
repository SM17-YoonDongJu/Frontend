"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import { ChevronDown } from "@/shared/ui/icons/ChevronDown";
import { Lock } from "@/shared/ui/icons/Lock";
import { PasswordLoginForm } from "./PasswordLoginForm";

const PANEL_ID = "password-login-panel";

/**
 * 아이디·비밀번호 로그인 영역. 기본은 접힌 상태 —
 * 주 경로는 소셜 로그인이라 입력 칸이 처음부터 화면을 차지하지 않게 한다.
 */
export function PasswordLoginSection() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex w-full flex-col gap-3.5">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={PANEL_ID}
        className="flex w-full items-center justify-center gap-2 rounded-button border border-line bg-card px-[1.125rem] py-3 text-[0.9375rem] font-semibold text-ink transition hover:bg-paper focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-gold-soft"
      >
        <Lock className="size-[1rem] text-ink-3" />
        아이디로 로그인
        <ChevronDown className={cn("size-[1rem] text-ink-3 transition", open && "rotate-180")} />
      </button>

      {open && (
        <div id={PANEL_ID}>
          <PasswordLoginForm />
        </div>
      )}
    </div>
  );
}
