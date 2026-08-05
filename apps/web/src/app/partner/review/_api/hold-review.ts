import "@/shared/api/client";
import { addHold } from "@/shared/api/generated/sdk.gen";
import { holdReviewSchema } from "../_model/review.schema";
import type { HoldReason, HoldReview } from "../_model/review.schema";

export interface HoldReviewInput {
  reportId: string;
  reason: HoldReason;
  /** OTHER면 필수. */
  reasonDetail?: string | null;
}

export async function holdReview({
  reportId,
  reason,
  reasonDetail,
}: HoldReviewInput): Promise<HoldReview> {
  const { data } = await addHold({
    throwOnError: true,
    path: { reportId },
    body: { reason, reasonDetail: reasonDetail ?? undefined },
  });
  return holdReviewSchema.parse(data);
}
