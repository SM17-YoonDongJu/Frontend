import "@/shared/api/client";
import { getMe as getMeRequest } from "@/shared/api/generated/sdk.gen";
import { meSchema } from "@/shared/model/user";
import type { Me } from "@/shared/model/user";

export async function getMe(): Promise<Me> {
  // 인증 상태 프로브 — 401을 useAuthStatus가 "비로그인"으로 해석하므로 로그인 안내 이동을 타지 않는다.
  const { data } = await getMeRequest({
    throwOnError: true,
    meta: { skipAuthRedirect: true },
  });
  return meSchema.parse(data);
}
