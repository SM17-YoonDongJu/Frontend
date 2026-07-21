import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { readChatResponseSchema } from "./chat.schema";
import type { ReadChatResponse } from "./chat.schema";

// POST /chats/{id}/read — 방 진입 시 읽음 처리(이후 unread_count 0).
export function readChat(chatRoomId: string): Promise<ReadChatResponse> {
  return fetchJson(
    `${API_BASE_URL}/chats/${chatRoomId}/read`,
    readChatResponseSchema,
    { method: "POST" },
  );
}
