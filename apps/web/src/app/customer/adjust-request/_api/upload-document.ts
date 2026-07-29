import { uploadFile } from "@/shared/api/upload-file";
import type { UploadDocumentResponse } from "../_model/types";

/** 증빙 파일 1건 업로드(presigned URL 발급 → S3 직접 PUT). 성공 시 저장 url 반환. */
export function uploadDocument(file: File): Promise<UploadDocumentResponse> {
  return uploadFile(file, "report_document");
}
