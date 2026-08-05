import "@/shared/api/client";
import { getMyInsurances } from "@/shared/api/generated/sdk.gen";
import { insuranceListSchema } from "../_model/insurance.schema";
import type { InsuranceList } from "../_model/types";

// GET /users/me/insurances
export async function getInsuranceList(): Promise<InsuranceList> {
  const { data } = await getMyInsurances({ throwOnError: true });
  return insuranceListSchema.parse(data);
}
