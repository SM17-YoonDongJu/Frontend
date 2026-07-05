import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { sendChatMessageResponseSchema } from "./chat.schema";
import type { SendChatMessageBody, SendChatMessageResponse } from "./chat.schema";

export function sendChatMessage(
  chatRoomId: string,
  body: SendChatMessageBody,
): Promise<SendChatMessageResponse> {
  return fetchJson(
    `${API_BASE_URL}/chats/${chatRoomId}/messages`,
    sendChatMessageResponseSchema,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
}
