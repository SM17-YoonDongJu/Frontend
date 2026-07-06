import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import {
  registerResponseSchema,
  type RegisterBody,
  type RegisterResponse,
} from "../_model/register.schema";

// POST /auth/register — 봉투 해제 + 응답 zod 검증. 실패 시 fetchJson이 err.name=서버 code로 throw.
export function register(body: RegisterBody): Promise<RegisterResponse> {
  return fetchJson(`${API_BASE_URL}/auth/register`, registerResponseSchema, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
