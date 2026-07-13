import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { chatListSchema } from "./chat.schema";
import type { ChatList } from "./chat.schema";

export function getChatList(): Promise<ChatList> {
  return fetchJson(`${API_BASE_URL}/chats`, chatListSchema);
}
