import "@/shared/api/client";
import { oauthCallback as oauthCallbackRequest } from "@/shared/api/generated/sdk.gen";
import {
  oauthCallbackSchema,
  type OauthCallback,
  type OauthProvider,
} from "../_model/oauth-callback.schema";

export async function getOauthCallback(
  provider: OauthProvider,
  code: string,
  state?: string,
): Promise<OauthCallback> {
  // authorize에 사용한 redirect_uri와 글자까지 일치해야 백엔드 토큰 교환이 성공한다.
  const redirectUri = `${window.location.origin}/login/oauth2/code/${provider}`;

  const { data } = await oauthCallbackRequest({
    throwOnError: true,
    path: { provider },
    query: { code, state, redirect_uri: redirectUri },
  });
  return oauthCallbackSchema.parse(data);
}
