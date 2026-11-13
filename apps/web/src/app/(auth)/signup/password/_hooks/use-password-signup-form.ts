"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { usePasswordSignup } from "@/shared/api/use-password-signup";
import { homePathByUserType } from "@/shared/model/home-path";
import { passwordSignupBodySchema } from "@/shared/model/password-auth";
import { toPasswordAuthErrorView } from "@/shared/model/password-auth-error";
import { deriveUserType } from "@/shared/model/user";

export type PasswordSignupField = "loginId" | "password" | "name";

export type PasswordSignupDraft = Record<PasswordSignupField, string>;

type FieldErrors = Partial<Record<PasswordSignupField, string>>;

const EMPTY_DRAFT: PasswordSignupDraft = { loginId: "", password: "", name: "" };

/** zod 이슈를 필드별 첫 문구로 접는다 — 한 입력에 여러 규칙이 걸려도 하나만 보여준다. */
function toFieldErrors(issues: readonly { path: readonly PropertyKey[]; message: string }[]) {
  const errors: FieldErrors = {};
  for (const issue of issues) {
    const field = issue.path[0];
    if (typeof field !== "string") continue;
    const key = field as PasswordSignupField;
    errors[key] ??= issue.message;
  }
  return errors;
}

/**
 * 아이디·비밀번호 가입 폼 상태. 제출 시 클라이언트 검증 → 서버 호출 순.
 * 가입 성공 응답의 쿠키로 세션이 서므로 로그인 API를 다시 부르지 않고 역할별 홈으로 보낸다.
 */
export function usePasswordSignupForm() {
  const router = useRouter();
  const signup = usePasswordSignup();
  const [draft, setDraft] = useState<PasswordSignupDraft>(EMPTY_DRAFT);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const change = useCallback((field: PasswordSignupField, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
    // 입력을 고치는 순간 해당 필드 안내만 지운다 — 폼 전체 에러는 재제출까지 남겨둔다.
    setFieldErrors((prev) => (prev[field] === undefined ? prev : { ...prev, [field]: undefined }));
  }, []);

  const submit = useCallback(() => {
    if (signup.isPending) return;

    setFormError(null);
    const parsed = passwordSignupBodySchema.safeParse(draft);
    if (!parsed.success) {
      setFieldErrors(toFieldErrors(parsed.error.issues));
      return;
    }
    setFieldErrors({});

    signup.mutate(parsed.data, {
      onSuccess: (result) => {
        router.replace(homePathByUserType(deriveUserType(result.role)));
      },
      onError: (error) => {
        const view = toPasswordAuthErrorView(error);
        if (!view) return;
        if (view.field) setFieldErrors({ [view.field]: view.message });
        else setFormError(view.message);
      },
    });
  }, [draft, router, signup]);

  return {
    draft,
    fieldErrors,
    formError,
    pending: signup.isPending,
    change,
    submit,
  };
}
