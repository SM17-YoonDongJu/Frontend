import "@/shared/api/client";
import { getMessages as getChatMessagesRequest } from "@/shared/api/generated/sdk.gen";
import { chatMessagesSchema } from "./chat.schema";
import type { ChatMessages } from "./chat.schema";

// 커서 페이지네이션(?cursor&size, 기본 30). MVP는 단일 페이지지만 확장 대비 시그니처 유지.
export async function getChatMessages(
  chatRoomId: string,
  cursor?: string,
  size = 30,
): Promise<ChatMessages> {
  const { data } = await getChatMessagesRequest({
    throwOnError: true,
    path: { chatRoomId },
    query: { cursor, size },
  });
  return chatMessagesSchema.parse(data);
}
