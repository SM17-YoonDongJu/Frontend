import { z } from "zod";
import type { OAuthCallbackResponse } from "@/shared/api/generated/types.gen";
import type { AssertFieldsExistInSpec, ExpectDriftCheck } from "@/shared/lib/drift-check";

/** OAuth 콜백. 출처: API 명세 GET /auth/oauth2/{provider}/callback. 필드명 명세 그대로. */

export const oauthProviderSchema = z.enum(["kakao", "naver", "apple"]);
export type OauthProvider = z.infer<typeof oauthProviderSchema>;

export const oauthCallbackSchema = z.object({
  userId: z.uuid().nullable(),
  isNewUser: z.boolean(),
  signupTicket: z.string().nullable(),
});
export type OauthCallback = z.infer<typeof oauthCallbackSchema>;

type _OauthCallbackDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<OauthCallback, OAuthCallbackResponse>
>;
