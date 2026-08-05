import "@/shared/api/client";
import { read as readChatRequest } from "@/shared/api/generated/sdk.gen";
import { readChatResponseSchema } from "./chat.schema";
import type { ReadChatResponse } from "./chat.schema";

// POST /chats/{id}/read — 방 진입 시 읽음 처리(이후 unread_count 0).
export async function readChat(chatRoomId: string): Promise<ReadChatResponse> {
  const { data } = await readChatRequest({
    throwOnError: true,
    path: { chatRoomId },
  });
  return readChatResponseSchema.parse(data);
}
