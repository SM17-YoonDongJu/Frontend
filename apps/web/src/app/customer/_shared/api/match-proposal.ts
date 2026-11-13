import { z } from "zod";
import "@/shared/api/client";
import { decide } from "@/shared/api/generated/sdk.gen";
import { matchStatusSchema } from "@/shared/api/chat/chat.schema";

// PATCH /reports/{reportId}/proposals/{proposalId} {status} — 상담 수락·거절.
// ACCEPTED는 상담 채팅방을 열고(이미 있으면 같은 방 재사용) 제안·리포트를 COUNSELING으로 바꾼다.
// 최종 채택은 이 경로가 아니라 PATCH /chats/{chatRoomId}/accept다 — 이미 COUNSELING인 제안에
// 다시 ACCEPTED를 보내면 아무것도 바뀌지 않고 200만 돌아온다(#325).
const matchProposalResultSchema = z.object({
  reportId: z.uuid(),
  proposalId: z.uuid(),
  adjusterId: z.uuid(),
  reportStatus: z.string(), // ⚠️ 응답 enum 확정 전 string(CLOSED/AWAITING_ADOPTION 등)
  reviewStatus: matchStatusSchema,
  // ACCEPTED 요청으로 열린 방 id. REJECTED 요청에서는 항상 null이다.
  chatRoomId: z.uuid().nullish(),
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
  const result = matchProposalResultSchema.parse(data);
  // 수락했는데 방 id가 없으면 성공으로 취급하지 않는다. 백엔드는 같은 요청에 같은 방을 돌려주므로 다시 누르면 받을 수 있다.
  if (status === "ACCEPTED" && result.chatRoomId == null) {
    throw new Error("상담 채팅방 정보를 받지 못했어요.");
  }
  return result;
}
