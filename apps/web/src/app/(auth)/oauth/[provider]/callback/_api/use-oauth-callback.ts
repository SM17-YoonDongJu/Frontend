"use client";

import { useQuery } from "@tanstack/react-query";
import { authKeys } from "@/shared/api/query-keys";
import { getOauthCallback } from "./get-oauth-callback";
import {
  oauthProviderSchema,
  type OauthProvider,
} from "../_model/oauth-callback.schema";

interface UseOauthCallbackParams {
  provider: string;
  code: string | null;
  state?: string | null;
}

/**
 * OAuth 콜백 1회성 인증 교환. 캐싱 부적합(staleTime 0·gcTime 0)이라 매 진입 재요청,
 * 실패 시 refetch()로 재시도. provider/code가 유효할 때만 enabled.
 */
export function useOauthCallback({ provider, code, state }: UseOauthCallbackParams) {
  const parsedProvider = oauthProviderSchema.safeParse(provider);
  const validProvider: OauthProvider | null = parsedProvider.success
    ? parsedProvider.data
    : null;
  const enabled = validProvider !== null && code !== null && code !== "";

  return useQuery({
    queryKey: authKeys.oauthCallback(validProvider ?? provider, code ?? "").queryKey,
    queryFn: () => {
      if (validProvider === null || !code) {
        throw new Error("유효하지 않은 로그인 요청입니다.");
      }
      return getOauthCallback(validProvider, code, state ?? undefined);
    },
    enabled,
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });
}
