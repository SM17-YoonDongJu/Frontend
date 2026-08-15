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
    body: {
      provider: body.provider,
      social_token: body.socialToken,
      name: body.name,
      user_type: body.userType,
      gender: body.gender,
      birth_date: body.birthDate,
      phone_number: body.phoneNumber,
      region: body.region,
    },
  });
  return registerResponseSchema.parse(data);
}
