import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { meSchema } from "@/shared/model/user";
import type { Me } from "@/shared/model/user";

export function getMe(): Promise<Me> {
  return fetchJson(`${API_BASE_URL}/users/me`, meSchema);
}
