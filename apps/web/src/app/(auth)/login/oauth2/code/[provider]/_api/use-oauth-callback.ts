"use client";

import { useQuery } from "@tanstack/react-query";
import { authKeys } from "@/shared/api/query-keys";
import { getOauthCallback } from "./get-oauth-callback";
import { isCodeConsumed, markCodeConsumed } from "./consumed-code";
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
 * OAuth 콜백 1회성 인증 교환, 실패 시 refetch()로 재시도.
 * 카카오/네이버 인가코드는 1회용이라 성공한 code는 sessionStorage에 기록해 재요청을 막는다
 * (콜백 페이지가 리마운트돼도 이미 소모된 code로 다시 호출하지 않음).
 */
export function useOauthCallback({ provider, code, state }: UseOauthCallbackParams) {
  const parsedProvider = oauthProviderSchema.safeParse(provider);
  const validProvider: OauthProvider | null = parsedProvider.success
    ? parsedProvider.data
    : null;
  const enabled =
    validProvider !== null &&
    code !== null &&
    code !== "" &&
    !isCodeConsumed(validProvider, code);

  return useQuery({
    queryKey: authKeys.oauthCallback(validProvider ?? provider, code ?? "").queryKey,
    queryFn: async () => {
      if (validProvider === null || !code) {
        throw new Error("유효하지 않은 로그인 요청입니다.");
      }
      const result = await getOauthCallback(validProvider, code, state ?? undefined);
      markCodeConsumed(validProvider, code);
      return result;
    },
    enabled,
    retry: false,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
