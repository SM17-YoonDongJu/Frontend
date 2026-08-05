import "@/shared/api/client";
import { accept as acceptChatRequest } from "@/shared/api/generated/sdk.gen";
import { acceptChatResponseSchema } from "./chat.schema";
import type { AcceptChatResponse } from "./chat.schema";

// PATCH /chats/{id}/accept — 상담 수락(담당 사정사 확정·리포트 종결). 파이프라인 방만(그 외 409).
export async function acceptChat(chatRoomId: string): Promise<AcceptChatResponse> {
  const { data } = await acceptChatRequest({
    throwOnError: true,
    path: { chatRoomId },
  });
  return acceptChatResponseSchema.parse(data);
}
