"use client";

import { useCallback, useState } from "react";
import { usePasswordLogin } from "@/shared/api/use-password-login";
import { passwordLoginBodySchema } from "@/shared/model/password-auth";
import { toPasswordAuthErrorView } from "@/shared/model/password-auth-error";

export type PasswordLoginField = "loginId" | "password";

export type PasswordLoginDraft = Record<PasswordLoginField, string>;

type FieldErrors = Partial<Record<PasswordLoginField, string>>;

const EMPTY_DRAFT: PasswordLoginDraft = { loginId: "", password: "" };

/**
 * 아이디·비밀번호 로그인 폼 상태.
 *
 * 성공 후 이동은 여기서 하지 않는다 — 뮤테이션이 user.me를 무효화하면 로그인 화면의
 * 기존 리다이렉트 훅이 복귀 경로 또는 역할별 홈으로 보낸다(소셜 로그인 성공과 같은 경로).
 */
export function usePasswordLoginForm() {
  const login = usePasswordLogin();
  const [draft, setDraft] = useState<PasswordLoginDraft>(EMPTY_DRAFT);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const change = useCallback((field: PasswordLoginField, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => (prev[field] === undefined ? prev : { ...prev, [field]: undefined }));
  }, []);

  const submit = useCallback(() => {
    // 백엔드에 로그인 시도 횟수 제한이 없어 연타를 FE에서 막는다(버튼 비활성화와 이중 가드).
    if (login.isPending) return;

    setFormError(null);
    const parsed = passwordLoginBodySchema.safeParse(draft);
    if (!parsed.success) {
      const errors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field !== "string") continue;
        const key = field as PasswordLoginField;
        errors[key] ??= issue.message;
      }
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    login.mutate(parsed.data, {
      onError: (error) => {
        const view = toPasswordAuthErrorView(error);
        if (!view) return;
        if (view.field === "loginId" || view.field === "password") {
          setFieldErrors({ [view.field]: view.message });
        } else {
          setFormError(view.message);
        }
      },
    });
  }, [draft, login]);

  return {
    draft,
    fieldErrors,
    formError,
    pending: login.isPending,
    change,
    submit,
  };
}
