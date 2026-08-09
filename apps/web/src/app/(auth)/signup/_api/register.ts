import "@/shared/api/client";
import { register1 as registerRequest } from "@/shared/api/generated/sdk.gen";
import {
  registerResponseSchema,
  type RegisterBody,
  type RegisterResponse,
} from "../_model/register.schema";

// POST /auth/register — 봉투 해제 + 응답 zod 검증. 실패 시 client가 err.name=서버 code로 throw.
export async function register(body: RegisterBody): Promise<RegisterResponse> {
  const { data } = await registerRequest({
    throwOnError: true,
    body,
  });
  return registerResponseSchema.parse(data);
}
