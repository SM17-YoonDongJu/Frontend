"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { usePasswordLoginForm } from "../_hooks/use-password-login-form";

/** 아이디·비밀번호 로그인 폼. 소셜 버튼과 같은 화면에 공존한다(모바일·데스크톱 공용). */
export function PasswordLoginForm() {
  const { draft, fieldErrors, formError, pending, change, submit } = usePasswordLoginForm();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit();
  };

  return (
    <form noValidate onSubmit={onSubmit} className="flex w-full flex-col gap-3.5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="login-login-id">아이디</Label>
        <Input
          id="login-login-id"
          name="loginId"
          value={draft.loginId}
          onChange={(event) => change("loginId", event.target.value)}
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="아이디"
          error={fieldErrors.loginId}
          aria-invalid={fieldErrors.loginId !== undefined}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="login-password">비밀번호</Label>
        <Input
          id="login-password"
          name="password"
          type="password"
          value={draft.password}
          onChange={(event) => change("password", event.target.value)}
          autoComplete="current-password"
          placeholder="비밀번호"
          error={fieldErrors.password}
          aria-invalid={fieldErrors.password !== undefined}
        />
      </div>

      {formError && (
        <p role="alert" className="rounded-input bg-terra-soft px-3.5 py-3 text-[0.8125rem] font-medium text-terra">
          {formError}
        </p>
      )}

      <Button type="submit" full loading={pending}>
        로그인
      </Button>

      <p className="text-center text-[0.78125rem] tracking-[-0.01rem] text-ink-3">
        아이디가 없으신가요?{" "}
        <Link href="/signup/password" className="font-semibold text-ink-2 underline underline-offset-2">
          아이디로 가입
        </Link>
      </p>
    </form>
  );
}
