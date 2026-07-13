import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { addInsuranceResultSchema } from "../_model/insurance.schema";
import type { AddInsuranceBody, AddInsuranceResult } from "../_model/types";

// POST /users/me/insurances — 201 `{ data: { id } }`. 생성 id 단건만 오므로 목록 갱신은 invalidate로 재조회한다.
export function addInsurance(body: AddInsuranceBody): Promise<AddInsuranceResult> {
  return fetchJson(`${API_BASE_URL}/users/me/insurances`, addInsuranceResultSchema, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
