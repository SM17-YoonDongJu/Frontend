import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { uploadChatAttachmentResponseSchema } from "./chat.schema";
import type { UploadChatAttachmentResponse } from "./chat.schema";

// POST /chats/{id}/attachments — multipart file 업로드 후 key 메타를 받아 메시지 전송에 attachment로 연결.
export function uploadChatAttachment(
  chatRoomId: string,
  file: File,
): Promise<UploadChatAttachmentResponse> {
  const formData = new FormData();
  formData.append("file", file);

  return fetchJson(
    `${API_BASE_URL}/chats/${chatRoomId}/attachments`,
    uploadChatAttachmentResponseSchema,
    {
      method: "POST",
      body: formData,
      // webkit 서비스워커가 multipart 파싱을 누락하는 경우 대비한 목 전용 폴백 메타
      headers: {
        "x-mock-file-name": encodeURIComponent(file.name),
        "x-mock-file-type": file.type || "application/octet-stream",
      },
    },
  );
}
