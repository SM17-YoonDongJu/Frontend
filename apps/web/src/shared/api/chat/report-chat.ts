import "@/shared/api/client";
import { report as reportChatRequest } from "@/shared/api/generated/sdk.gen";
import { reportChatResponseSchema } from "./chat.schema";
import type { ReportChatBody, ReportChatResponse } from "./chat.schema";

// POST /chats/{id}/report — 채팅 상대 신고. 중복 신고 제한 없음(매번 새 접수).
export async function reportChat(
  chatRoomId: string,
  body: ReportChatBody,
): Promise<ReportChatResponse> {
  const { data } = await reportChatRequest({
    throwOnError: true,
    path: { chatRoomId },
    body: { reason: body.reason, reasonDetail: body.reasonDetail ?? undefined },
  });
  return reportChatResponseSchema.parse(data);
}
