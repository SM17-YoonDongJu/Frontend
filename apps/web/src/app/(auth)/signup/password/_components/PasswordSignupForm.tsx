"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { usePasswordSignupForm } from "../_hooks/use-password-signup-form";

/** 아이디·비밀번호 가입 폼. 소셜 가입과 달리 본인 확인·약관 스텝이 없는 단일 화면이다. */
export function PasswordSignupForm() {
  const { draft, fieldErrors, formError, pending, change, submit } = usePasswordSignupForm();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit();
  };

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <h1 className="font-serif text-[1.5rem] font-bold tracking-[-0.01rem] text-ink">
          아이디로 가입하기
        </h1>
        <p className="text-[0.84375rem] leading-relaxed tracking-[-0.01rem] text-ink-3">
          소셜 계정 없이 아이디와 비밀번호로 시작할 수 있어요.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="signup-login-id">아이디</Label>
          <Input
            id="signup-login-id"
            name="loginId"
            value={draft.loginId}
            onChange={(event) => change("loginId", event.target.value)}
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="영문·숫자·밑줄 4~20자"
            hint="영문·숫자·밑줄만 쓸 수 있어요. 이메일은 아이디로 쓸 수 없어요."
            error={fieldErrors.loginId}
            aria-invalid={fieldErrors.loginId !== undefined}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="signup-password">비밀번호</Label>
          <Input
            id="signup-password"
            name="password"
            type="password"
            value={draft.password}
            onChange={(event) => change("password", event.target.value)}
            autoComplete="new-password"
            placeholder="8자 이상"
            hint="8자 이상 입력해 주세요."
            error={fieldErrors.password}
            aria-invalid={fieldErrors.password !== undefined}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="signup-name">이름</Label>
          <Input
            id="signup-name"
            name="name"
            value={draft.name}
            onChange={(event) => change("name", event.target.value)}
            autoComplete="name"
            placeholder="실명을 입력해 주세요"
            error={fieldErrors.name}
            aria-invalid={fieldErrors.name !== undefined}
          />
        </div>
      </div>

      {formError && (
        <p role="alert" className="rounded-input bg-terra-soft px-3.5 py-3 text-[0.8125rem] font-medium text-terra">
          {formError}
        </p>
      )}

      <Button type="submit" full size="lg" variant="gold" loading={pending}>
        가입하고 시작하기
      </Button>

      <p className="text-center text-[0.78125rem] tracking-[-0.01rem] text-ink-3">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="font-semibold text-ink-2 underline underline-offset-2">
          로그인
        </Link>
      </p>
    </form>
  );
}
