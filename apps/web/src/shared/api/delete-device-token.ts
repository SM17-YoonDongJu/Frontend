import { z } from "zod";
import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";

const deleteDeviceTokenSchema = z.null().nullish();

export async function deleteDeviceToken(token: string): Promise<void> {
  await fetchJson(`${API_BASE_URL}/users/me/device-tokens`, deleteDeviceTokenSchema, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
}
