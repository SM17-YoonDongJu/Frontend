import { uploadFile } from "@/shared/api/upload-file";
import type { UploadResponse } from "@/shared/model/upload.schema";

/** 증빙 파일 1건 업로드(POST /uploads multipart). 성공 시 저장 url 반환. */
export function uploadDocument(file: File): Promise<UploadResponse> {
  return uploadFile(file, "report_document");
}
