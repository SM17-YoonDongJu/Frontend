import "@/shared/api/client";
import { formDataBodySerializer } from "@/shared/api/generated/client";
import { uploadAttachment } from "@/shared/api/generated/sdk.gen";
import { uploadChatAttachmentResponseSchema } from "./chat.schema";
import type { UploadChatAttachmentResponse } from "./chat.schema";

// POST /chats/{id}/attachments — multipart file 업로드 후 key 메타를 받아 메시지 전송에 attachment로 연결.
// 명세가 이 엔드포인트를 multipart로 표기하지 않아 생성 SDK가 JSON으로 보낸다 → 직렬화를 호출부에서 교체.
export async function uploadChatAttachment(
  chatRoomId: string,
  file: File,
): Promise<UploadChatAttachmentResponse> {
  const { data } = await uploadAttachment({
    throwOnError: true,
    path: { chatRoomId },
    body: { file },
    ...formDataBodySerializer,
    headers: {
      "Content-Type": null,
      // webkit 서비스워커가 multipart 파싱을 누락하는 경우 대비한 목 전용 폴백 메타
      "x-mock-file-name": encodeURIComponent(file.name),
      "x-mock-file-type": file.type || "application/octet-stream",
    },
  });

  return uploadChatAttachmentResponseSchema.parse(data);
}
