"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import { ChevronDown } from "@/shared/ui/icons/ChevronDown";
import { Lock } from "@/shared/ui/icons/Lock";
import { PasswordLoginForm } from "./PasswordLoginForm";

const PANEL_ID = "password-login-panel";

/**
 * 아이디·비밀번호 로그인 영역. 기본은 접힌 상태이고 누르면 부드럽게 펼쳐진다 —
 * 주 경로는 소셜 로그인이라 입력 칸이 처음부터 화면을 차지하지 않게 한다.
 */
export function PasswordLoginSection() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex w-full flex-col">
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

      {/*
        높이를 grid 행 0fr→1fr로 전환해 내려오게 한다(height:auto는 transition이 안 된다).
        접어도 폼은 마운트된 채라 입력한 값이 남고, 닫힌 동안은 inert로 포커스·스크린 리더에서 뺀다.
      */}
      <div
        id={PANEL_ID}
        inert={!open}
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pt-3.5">
            <PasswordLoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
