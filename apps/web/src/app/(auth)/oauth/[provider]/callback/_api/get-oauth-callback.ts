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

  return fetchJson(
    `${API_BASE_URL}/auth/oauth2/${provider}/callback?${params.toString()}`,
    oauthCallbackSchema,
  );
}
