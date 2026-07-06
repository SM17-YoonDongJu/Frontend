import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { mypageSchema } from "../_model/mypage.schema";
import type { Mypage } from "../_model/types";

export function getMypage(): Promise<Mypage> {
  return fetchJson(`${API_BASE_URL}/adjusters/me/mypage`, mypageSchema);
}
