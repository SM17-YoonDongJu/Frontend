import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { draftPreviewSchema } from "../_model/draft-preview.schema";
import type { DraftPreview } from "../_model/draft-preview.schema";

export function getDraftPreview(reportId: string): Promise<DraftPreview> {
  return fetchJson(`${API_BASE_URL}/reports/${reportId}`, draftPreviewSchema);
}
