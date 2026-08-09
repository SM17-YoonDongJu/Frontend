import "@/shared/api/client";
import { listMyRooms as getChatListRequest } from "@/shared/api/generated/sdk.gen";
import { chatListSchema } from "./chat.schema";
import type { ChatList } from "./chat.schema";

export async function getChatList(): Promise<ChatList> {
  const { data } = await getChatListRequest({ throwOnError: true });
  return chatListSchema.parse(data);
}
