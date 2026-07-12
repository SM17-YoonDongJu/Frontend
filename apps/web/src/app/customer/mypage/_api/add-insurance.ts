import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { insuranceItemSchema } from "../_model/insurance.schema";
import type { AddInsuranceBody, InsuranceItem } from "../_model/types";

// CONTRACT(명세없음-임시, 이슈 #105): POST /users/me/insurances.
export function addInsurance(body: AddInsuranceBody): Promise<InsuranceItem> {
  return fetchJson(`${API_BASE_URL}/users/me/insurances`, insuranceItemSchema, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
