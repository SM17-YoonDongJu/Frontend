import { z } from "zod";
import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";

// 사정사별 제안 거절. body 없음, 성공 시 해당 제안은 목록에서 제외.
const rejectProposalResultSchema = z.object({
  reportId: z.uuid(),
  adjusterId: z.uuid(),
  rejected: z.boolean(),
});

export function rejectProposal(reportId: string, adjusterId: string) {
  return fetchJson(
    `${API_BASE_URL}/reports/${reportId}/proposals/${adjusterId}/reject`,
    rejectProposalResultSchema,
    { method: "PATCH" },
  );
}
