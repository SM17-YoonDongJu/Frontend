import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { acceptChatResponseSchema } from "./chat.schema";
import type { AcceptChatResponse } from "./chat.schema";

// PATCH /chats/{id}/accept — 상담 수락(담당 사정사 확정·리포트 종결). 파이프라인 방만(그 외 409).
export function acceptChat(chatRoomId: string): Promise<AcceptChatResponse> {
  return fetchJson(
    `${API_BASE_URL}/chats/${chatRoomId}/accept`,
    acceptChatResponseSchema,
    { method: "PATCH" },
  );
}
