"use client";

import { AuthHeader } from "../../_shared/ui/AuthHeader";
import { SignupRedirectGate } from "../_components/SignupRedirectGate";
import { PasswordSignupForm } from "./_components/PasswordSignupForm";

/**
 * 아이디·비밀번호 가입 (#322). 소셜 퍼널(/signup)과 분리된 단일 화면 —
 * 소셜 티켓 없이 진입하므로 퍼널의 티켓 가드를 타지 않는다.
 * 역할은 백엔드가 USER로 고정하므로 사정사 계정은 이 경로로 만들 수 없다.
 */
export default function PasswordSignupPage() {
  return (
    <SignupRedirectGate>
      <div className="flex min-h-dvh w-full flex-col">
        <AuthHeader className="hidden md:flex" />

        <div className="mx-auto flex w-full flex-1 flex-col justify-center px-5 pb-10 pt-8 md:max-w-[30rem] md:pb-16 md:pt-12">
          <div className="rounded-card-lg border border-line bg-card p-6 sm:p-8 md:p-9 md:shadow-modal">
            <PasswordSignupForm />
          </div>
        </div>
      </div>
    </SignupRedirectGate>
  );
}
