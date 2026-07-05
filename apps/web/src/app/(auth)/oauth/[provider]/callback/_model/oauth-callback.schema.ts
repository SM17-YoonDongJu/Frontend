import { z } from "zod";

/** OAuth 콜백. 출처: API 명세 GET /auth/oauth2/{provider}/callback. 필드명 명세 그대로. */

export const oauthProviderSchema = z.enum(["kakao", "naver"]);
export type OauthProvider = z.infer<typeof oauthProviderSchema>;

export const oauthCallbackSchema = z.object({
  userId: z.uuid(),
  isNewUser: z.boolean(),
  accessToken: z.string(),
  refreshToken: z.string(),
});
export type OauthCallback = z.infer<typeof oauthCallbackSchema>;
