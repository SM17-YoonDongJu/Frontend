import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { rejectChatResponseSchema } from "./chat.schema";
import type { RejectChatResponse } from "./chat.schema";

// PATCH /chats/{id}/reject — 상담 거절(재채택 대기 복귀). 방 CLOSED, 형제 방은 유지.
export function rejectChat(chatRoomId: string): Promise<RejectChatResponse> {
  return fetchJson(
    `${API_BASE_URL}/chats/${chatRoomId}/reject`,
    rejectChatResponseSchema,
    { method: "PATCH" },
  );
}
