import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { holdReviewSchema } from "../_model/review.schema";
import type { HoldReason, HoldReview } from "../_model/review.schema";

export interface HoldReviewInput {
  reportId: string;
  reason: HoldReason;
  /** OTHER면 필수. */
  reasonDetail?: string | null;
}

export function holdReview({
  reportId,
  reason,
  reasonDetail,
}: HoldReviewInput): Promise<HoldReview> {
  return fetchJson(`${API_BASE_URL}/reports/${reportId}/hold`, holdReviewSchema, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason, reasonDetail: reasonDetail ?? null }),
  });
}
