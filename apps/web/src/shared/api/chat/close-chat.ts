import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { closeChatResponseSchema } from "./chat.schema";
import type { CloseChatResponse } from "./chat.schema";

export function closeChat(chatRoomId: string): Promise<CloseChatResponse> {
  return fetchJson(
    `${API_BASE_URL}/chats/${chatRoomId}/close`,
    closeChatResponseSchema,
    { method: "PATCH" },
  );
}
