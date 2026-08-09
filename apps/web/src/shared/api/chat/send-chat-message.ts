import "@/shared/api/client";
import { send as sendChatMessageRequest } from "@/shared/api/generated/sdk.gen";
import { sendChatMessageResponseSchema } from "./chat.schema";
import type { SendChatMessageBody, SendChatMessageResponse } from "./chat.schema";

export async function sendChatMessage(
  chatRoomId: string,
  body: SendChatMessageBody,
): Promise<SendChatMessageResponse> {
  const { data } = await sendChatMessageRequest({
    throwOnError: true,
    path: { chatRoomId },
    body,
  });
  return sendChatMessageResponseSchema.parse(data);
}
