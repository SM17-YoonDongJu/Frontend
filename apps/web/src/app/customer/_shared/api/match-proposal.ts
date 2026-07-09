import { z } from "zod";
import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { matchStatusSchema } from "@/shared/api/chat/match-status";

// PATCH /reports/{reportId}/proposals/{proposalId} {status} — 채택·거절 통합.
// 채택 시 형제 제안은 서버가 캐스케이드 종료 → 응답은 대상 제안 결과만.
const matchProposalResultSchema = z.object({
  reportId: z.uuid(),
  proposalId: z.uuid(),
  adjusterId: z.uuid(),
  reportStatus: z.string(), // ⚠️ 응답 enum 확정 전 string(CLOSED/AWAITING_ADOPTION 등)
  reviewStatus: matchStatusSchema,
});

export type MatchProposalResult = z.infer<typeof matchProposalResultSchema>;

export function matchProposal(
  reportId: string,
  proposalId: string,
  status: "ACCEPTED" | "REJECTED",
) {
  return fetchJson(
    `${API_BASE_URL}/reports/${reportId}/proposals/${proposalId}`,
    matchProposalResultSchema,
    { method: "PATCH", body: JSON.stringify({ status }) },
  );
}
