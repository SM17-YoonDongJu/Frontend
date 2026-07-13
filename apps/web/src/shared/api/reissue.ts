import { z } from "zod";
import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";

export const REISSUE_PATH = "/auth/reissue";

const reissueSchema = z.null().nullish();

let inFlight: Promise<boolean> | null = null;

async function requestReissue(): Promise<boolean> {
  try {
    await fetchJson(`${API_BASE_URL}${REISSUE_PATH}`, reissueSchema, {
      method: "POST",
      skipTokenReissue: true,
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * refresh_token 쿠키로 access 토큰 재발급. RTR(회전)이라 동시 호출이 구 refresh를 두 번 보내면
 * 서버가 탈취로 간주하므로, 진행 중 요청이 있으면 그 promise를 공유해 네트워크 호출을 1회로 묶는다.
 */
export function reissueTokens(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);

  inFlight ??= requestReissue().finally(() => {
    inFlight = null;
  });
  return inFlight;
}
