import { API_BASE_URL } from "@/shared/api/config";
import { ERROR_CODES, getErrorCode } from "@/shared/api/error-codes";
import { fetchJson } from "@/shared/api/fetch-json";
import {
  uploadFileResponseSchema,
  type UploadPurpose,
  type UploadResponse,
} from "@/shared/model/upload.schema";

const UPLOAD_ERROR_MESSAGES: Record<string, string> = {
  [ERROR_CODES.UPLOAD_CONTENT_TYPE_NOT_ALLOWED]: "허용되지 않는 파일 형식이에요. PDF·JPG·PNG만 올릴 수 있어요.",
  [ERROR_CODES.UPLOAD_FILE_EMPTY]: "빈 파일은 올릴 수 없어요. 다른 파일을 선택해 주세요.",
  [ERROR_CODES.UPLOAD_FILE_TOO_LARGE]: "파일 용량이 허용 범위를 초과했어요.",
  [ERROR_CODES.MISSING_REQUIRED_FIELD]: "파일을 다시 선택해 주세요.",
  [ERROR_CODES.INVALID_REQUEST]: "업로드 요청이 올바르지 않아요. 다시 시도해 주세요.",
};

const UPLOAD_ERROR_FALLBACK = "업로드에 실패했어요. 다시 시도해 주세요.";

/** 업로드 실패 원인을 사용자 안내 문구로 변환. LOGIN_REQUIRED 등 인증 에러는 fetchJson이 이동 처리. */
export function uploadErrorMessage(error: unknown): string {
  const code = getErrorCode(error);
  return (code && UPLOAD_ERROR_MESSAGES[code]) ?? UPLOAD_ERROR_FALLBACK;
}

/**
 * POST /uploads — 서버 프록시 업로드. file·purpose 두 파트를 multipart 단일 요청으로 보내고
 * 서버가 S3에 저장한 최종 object URL을 받는다. Content-Type은 boundary 자동 생성에 맡긴다.
 */
export async function uploadFile(
  file: File,
  purpose: UploadPurpose,
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("purpose", purpose);

  const { s3Url } = await fetchJson(`${API_BASE_URL}/uploads`, uploadFileResponseSchema, {
    method: "POST",
    body: formData,
    // webkit 서비스워커가 multipart 파싱을 누락하는 경우 대비한 목 전용 폴백 메타
    headers: {
      "x-mock-file-name": encodeURIComponent(file.name),
      "x-mock-file-type": file.type || "application/octet-stream",
      "x-mock-file-size": String(file.size),
      "x-mock-upload-purpose": purpose,
    },
  });

  return { url: s3Url };
}
