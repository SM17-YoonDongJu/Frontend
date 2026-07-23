import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import {
  oauthCallbackSchema,
  type OauthCallback,
  type OauthProvider,
} from "../_model/oauth-callback.schema";

export function getOauthCallback(
  provider: OauthProvider,
  code: string,
  state?: string,
): Promise<OauthCallback> {
  const params = new URLSearchParams({ code });
  if (state) params.set("state", state);
  // authorize에 사용한 redirect_uri와 글자까지 일치해야 백엔드 토큰 교환이 성공한다.
  params.set(
    "redirect_uri",
    `${window.location.origin}/login/oauth2/code/${provider}`,
  );

  return fetchJson(
    `${API_BASE_URL}/auth/oauth2/${provider}/callback?${params.toString()}`,
    oauthCallbackSchema,
  );
}
