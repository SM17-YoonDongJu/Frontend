import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { chatRoomSchema } from "./chat.schema";
import type { ChatRoom } from "./chat.schema";

// GET /chats/{id} — 딥링크 진입 시 목록 없이 방 단건 조회.
export function getChatRoom(chatRoomId: string): Promise<ChatRoom> {
  return fetchJson(`${API_BASE_URL}/chats/${chatRoomId}`, chatRoomSchema);
}
