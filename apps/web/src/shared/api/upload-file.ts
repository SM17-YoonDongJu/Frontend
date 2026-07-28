import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import {
  presignedUploadResponseSchema,
  type UploadPurpose,
  type UploadResponse,
} from "@/shared/model/upload.schema";

/**
 * presigned PUT URL 발급(POST /uploads) → 파일 바이너리 직접 PUT(S3) → 최종 object URL 반환.
 * purpose별 key prefix·MIME 화이트리스트는 백엔드가 검증한다.
 */
export async function uploadFile(
  file: File,
  purpose: UploadPurpose,
): Promise<UploadResponse> {
  const { uploadUrl, s3Url } = await fetchJson(
    `${API_BASE_URL}/uploads`,
    presignedUploadResponseSchema,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        contentType: file.type,
        purpose,
      }),
    },
  );

  const putResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!putResponse.ok) {
    throw new Error("파일 업로드에 실패했습니다.");
  }

  return { url: s3Url };
}
