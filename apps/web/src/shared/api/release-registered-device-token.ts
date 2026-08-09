import { isBridgeAvailable } from "@insurance/bridge/web";
import {
  clearRegisteredDeviceToken,
  loadRegisteredDeviceToken,
} from "@/shared/lib/device-token-storage";
import { deleteDeviceToken } from "./delete-device-token";

/**
 * 세션이 살아있는 동안 서버에 등록된 기기 푸시 토큰을 해제한다(로그아웃·탈퇴 공용).
 * 해제 실패가 세션 종료 자체를 막으면 안 되므로 best-effort — 오류는 삼킨다.
 */
export async function releaseRegisteredDeviceToken(): Promise<void> {
  if (!isBridgeAvailable()) return;

  const registered = loadRegisteredDeviceToken();
  if (!registered) return;

  try {
    await deleteDeviceToken(registered.token);
    clearRegisteredDeviceToken();
  } catch {}
}
