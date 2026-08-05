import { z } from "zod";
import "@/shared/api/client";
import { decide } from "@/shared/api/generated/sdk.gen";
import { matchStatusSchema } from "@/shared/api/chat/chat.schema";

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

export async function matchProposal(
  reportId: string,
  proposalId: string,
  status: "ACCEPTED" | "REJECTED",
) {
  const { data } = await decide({
    throwOnError: true,
    path: { reportId, proposalId },
    body: { status },
  });
  return matchProposalResultSchema.parse(data);
}
