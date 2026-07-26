import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { deviceTokenSchema } from "@/shared/model/device-token.schema";
import type {
  DeviceToken,
  RegisterDeviceTokenBody,
} from "@/shared/model/device-token.schema";

export function registerDeviceToken(
  body: RegisterDeviceTokenBody,
): Promise<DeviceToken> {
  return fetchJson(`${API_BASE_URL}/users/me/device-tokens`, deviceTokenSchema, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
