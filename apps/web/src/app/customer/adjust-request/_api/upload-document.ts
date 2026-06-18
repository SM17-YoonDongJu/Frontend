import { API_BASE_URL } from "@/shared/api/config";
import { uploadDocumentResponseSchema } from "../_model/report-request.schema";
import type { UploadDocumentResponse } from "../_model/types";

/** 증빙 파일 1건 업로드. 성공 시 저장 url 반환. */
export async function uploadDocument(file: File): Promise<UploadDocumentResponse> {
  const body = new FormData();
  body.append("file", file);

  const res = await fetch(`${API_BASE_URL}/uploads`, { method: "POST", body });
  const json: unknown = await res.json();

  // 실패 envelope({status,code,message}) 또는 HTTP 실패 → 에러
  if (!res.ok || (json as { code?: string }).code) {
    throw new Error((json as { message?: string }).message ?? "업로드에 실패했습니다.");
  }

  return uploadDocumentResponseSchema.parse((json as { data: unknown }).data);
}
