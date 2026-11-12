import { z } from "zod";
import { userRoleSchema } from "./user-role";
import type {
  PasswordAuthResponse as GenPasswordAuthResponse,
  PasswordLoginRequest,
  PasswordSignupRequest,
} from "@/shared/api/generated/types.gen";
import type { AssertFieldsExistInSpec, ExpectDriftCheck } from "@/shared/lib/drift-check";

const LOGIN_ID_PATTERN = /^[A-Za-z0-9_]{4,20}$/;
const PASSWORD_MAX_BYTES = 72;

/** 백엔드가 bcrypt 72바이트 상한을 그대로 노출 — 한글은 글자당 3바이트라 글자 수만으로는 못 막는다. */
export function passwordByteLength(password: string): number {
  return new TextEncoder().encode(password).length;
}

export const loginIdSchema = z
  .string()
  .regex(LOGIN_ID_PATTERN, "아이디는 영문·숫자·밑줄 4~20자로 입력해 주세요.");

export const passwordSchema = z
  .string()
  .min(8, "비밀번호는 8자 이상으로 입력해 주세요.")
  .max(72, "비밀번호는 72자 이하로 입력해 주세요.")
  .refine(
    (value) => passwordByteLength(value) <= PASSWORD_MAX_BYTES,
    "비밀번호가 너무 깁니다. 한글은 글자당 3자로 계산돼요.",
  );

/** POST /auth/password/signup 요청 body. 아이디·비밀번호·이름만 받는다(생년월일·성별·전화번호 미수집). */
export const passwordSignupBodySchema = z.object({
  loginId: loginIdSchema,
  password: passwordSchema,
  name: z.string().min(1, "이름을 입력해 주세요.").max(30, "이름은 30자 이하로 입력해 주세요."),
});

/** POST /auth/password/login 요청 body. 아이디는 백엔드가 소문자로 정규화해 대소문자를 구분하지 않는다. */
export const passwordLoginBodySchema = z.object({
  loginId: z.string().min(1, "아이디를 입력해 주세요."),
  password: z.string().min(1, "비밀번호를 입력해 주세요."),
});

/**
 * 가입(201)·로그인(200) 공통 응답 data. 토큰은 소셜과 동일하게 HttpOnly 쿠키로 내려오고
 * 응답 body엔 없다 — 보낼 때는 `name`, 받을 때는 `nickname`(소셜 가입 계약과 동일).
 * 명세의 role은 string이라 FE에서 enum으로 좁힌다.
 */
export const passwordAuthResponseSchema = z.object({
  userId: z.string(),
  nickname: z.string(),
  role: userRoleSchema,
});

export type PasswordSignupBody = z.infer<typeof passwordSignupBodySchema>;
export type PasswordLoginBody = z.infer<typeof passwordLoginBodySchema>;
export type PasswordAuthResponse = z.infer<typeof passwordAuthResponseSchema>;

type _SignupBodyDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<PasswordSignupBody, PasswordSignupRequest>
>;
type _LoginBodyDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<PasswordLoginBody, PasswordLoginRequest>
>;
type _AuthResponseDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<PasswordAuthResponse, GenPasswordAuthResponse>
>;
