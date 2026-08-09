import "@/shared/api/client";
import { dashboard as dashboardRequest } from "@/shared/api/generated/sdk.gen";
import { dashboardSchema, type Dashboard } from "../_model/dashboard.schema";

export async function getDashboard(): Promise<Dashboard> {
  const { data } = await dashboardRequest({ throwOnError: true });
  return dashboardSchema.parse(data);
}
