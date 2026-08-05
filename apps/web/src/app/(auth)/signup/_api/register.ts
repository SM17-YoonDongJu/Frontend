import "@/shared/api/client";
import { register1 as registerRequest } from "@/shared/api/generated/sdk.gen";
import {
  registerResponseSchema,
  type RegisterBody,
  type RegisterResponse,
} from "../_model/register.schema";

// POST /auth/register — 봉투 해제 + 응답 zod 검증. 실패 시 client가 err.name=서버 code로 throw.
// CONTRACT(드리프트): 명세 필드명은 name, FE 폼/naming-dictionary는 nickname 사용 — 전송 시에만 매핑.
export async function register(body: RegisterBody): Promise<RegisterResponse> {
  const { nickname, ...rest } = body;
  const { data } = await registerRequest({
    throwOnError: true,
    body: { ...rest, name: nickname },
  });
  return registerResponseSchema.parse(data);
}
