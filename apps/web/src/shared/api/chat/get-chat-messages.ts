import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { chatMessagesSchema } from "./chat.schema";
import type { ChatMessages } from "./chat.schema";

// 커서 페이지네이션(?cursor&size, 기본 30). MVP는 단일 페이지지만 확장 대비 시그니처 유지.
export function getChatMessages(
  chatRoomId: string,
  cursor?: string,
  size = 30,
): Promise<ChatMessages> {
  const query = new URLSearchParams();
  if (cursor) query.set("cursor", cursor);
  query.set("size", String(size));

  return fetchJson(
    `${API_BASE_URL}/chats/${chatRoomId}/messages?${query.toString()}`,
    chatMessagesSchema,
  );
}
