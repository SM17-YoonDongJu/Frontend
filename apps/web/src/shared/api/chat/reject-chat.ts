import "@/shared/api/client";
import { reject as rejectChatRequest } from "@/shared/api/generated/sdk.gen";
import { rejectChatResponseSchema } from "./chat.schema";
import type { RejectChatResponse } from "./chat.schema";

// PATCH /chats/{id}/reject — 상담 거절(재채택 대기 복귀). 방 CLOSED, 형제 방은 유지.
export async function rejectChat(chatRoomId: string): Promise<RejectChatResponse> {
  const { data } = await rejectChatRequest({
    throwOnError: true,
    path: { chatRoomId },
  });
  return rejectChatResponseSchema.parse(data);
}
