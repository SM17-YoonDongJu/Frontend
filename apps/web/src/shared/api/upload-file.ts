import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { uploadResponseSchema } from "@/shared/model/upload.schema";
import type { UploadResponse } from "@/shared/model/upload.schema";

// 범용 파일 업로드 — POST /uploads(S3 private, JPG/PNG). 결과 URL을 avatarUrl 등으로 PATCH.
export function uploadFile(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  return fetchJson(`${API_BASE_URL}/uploads`, uploadResponseSchema, {
    method: "POST",
    body: formData,
  });
}
