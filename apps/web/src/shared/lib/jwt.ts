import { userRoleSchema, type UserRole } from "@/shared/model/user-role";

/**
 * access_token(JWT) payload에서 role만 꺼낸다. 서명 검증은 하지 않는다 —
 * 여기서 읽은 role은 화면 셸 노출을 막는 UX 가드용이고, 최종 인가는 API 403이 담당한다.
 */
export function getRoleFromAccessToken(token: string): UserRole | null {
  const payloadSegment = token.split(".")[1];
  if (!payloadSegment) return null;

  try {
    const unpadded = payloadSegment.replace(/-/g, "+").replace(/_/g, "/");
    const base64 = unpadded.padEnd(unpadded.length + ((4 - (unpadded.length % 4)) % 4), "=");
    const json = atob(base64);
    const payload: unknown = JSON.parse(json);
    if (typeof payload !== "object" || payload === null || !("role" in payload)) {
      return null;
    }
    return userRoleSchema.parse((payload as { role: unknown }).role);
  } catch {
    return null;
  }
}
