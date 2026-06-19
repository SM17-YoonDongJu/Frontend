import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { uploadDocumentResponseSchema } from "../_model/report-request.schema";
import type { UploadDocumentResponse } from "../_model/types";

/** 증빙 파일 1건 업로드. 성공 시 저장 url 반환. */
export function uploadDocument(file: File): Promise<UploadDocumentResponse> {
  const body = new FormData();
  body.append("file", file);

  return fetchJson(`${API_BASE_URL}/uploads`, uploadDocumentResponseSchema, {
    method: "POST",
    body,
  });
}
