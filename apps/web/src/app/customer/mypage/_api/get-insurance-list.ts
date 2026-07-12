import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { insuranceListSchema } from "../_model/insurance.schema";
import type { InsuranceList } from "../_model/types";

// CONTRACT(명세없음-임시, 이슈 #105): GET /users/me/insurances.
export function getInsuranceList(): Promise<InsuranceList> {
  return fetchJson(`${API_BASE_URL}/users/me/insurances`, insuranceListSchema);
}
