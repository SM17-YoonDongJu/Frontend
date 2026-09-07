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
    body: {
      content: body.content,
      attachments: body.attachments?.map((attachment) => ({
        attachment_key: attachment.attachmentKey,
        name: attachment.name,
        content_type: attachment.contentType,
        size: attachment.size,
      })),
    },
  });
  return sendChatMessageResponseSchema.parse(data);
}
