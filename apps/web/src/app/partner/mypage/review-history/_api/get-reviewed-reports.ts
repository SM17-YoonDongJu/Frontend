import "@/shared/api/client";
import { reviewedReports as reviewedReportsRequest } from "@/shared/api/generated/sdk.gen";
import type { ReviewedReportsFilter } from "@/shared/api/query-keys";
import { reviewedReportsSchema } from "../_model/reviewed-reports.schema";
import type { ReviewedReports } from "../_model/types";

/**
 * GET /adjusters/me/reviewed-reports?status=&month=&page=&size=
 * page는 0부터. status 미지정(전체=ALL)이면 파라미터 생략.
 */
export async function getReviewedReports(
  filter: ReviewedReportsFilter | undefined,
  page: number,
): Promise<ReviewedReports> {
  const { data } = await reviewedReportsRequest({
    throwOnError: true,
    query: {
      status: filter?.status,
      month: filter?.month,
      page,
      size: filter?.size,
    },
  });
  return reviewedReportsSchema.parse(data);
}
