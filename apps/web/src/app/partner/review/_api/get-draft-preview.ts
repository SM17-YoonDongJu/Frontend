import "@/shared/api/client";
import { detail } from "@/shared/api/generated/sdk.gen";
import { draftPreviewSchema } from "../_model/draft-preview.schema";
import type { DraftPreview } from "../_model/draft-preview.schema";

export async function getDraftPreview(reportId: string): Promise<DraftPreview> {
  const { data } = await detail({ throwOnError: true, path: { reportId } });
  return draftPreviewSchema.parse(data);
}
