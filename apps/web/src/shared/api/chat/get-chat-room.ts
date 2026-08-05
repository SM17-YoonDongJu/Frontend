import "@/shared/api/client";
import { getRoom as getChatRoomRequest } from "@/shared/api/generated/sdk.gen";
import { chatRoomSchema } from "./chat.schema";
import type { ChatRoom } from "./chat.schema";

// GET /chats/{id} — 딥링크 진입 시 목록 없이 방 단건 조회.
export async function getChatRoom(chatRoomId: string): Promise<ChatRoom> {
  const { data } = await getChatRoomRequest({
    throwOnError: true,
    path: { chatRoomId },
  });
  return chatRoomSchema.parse(data);
}
