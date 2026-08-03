import { z } from "zod";

// 업로드 용도 — 백엔드 UploadPurpose(키 prefix·MIME 화이트리스트를 용도별로 소유).
export const uploadPurposeSchema = z.enum([
  "report_document",
  "license",
  "registration",
  "avatar",
]);
export type UploadPurpose = z.infer<typeof uploadPurposeSchema>;

// POST /uploads 응답(명세 3a830798…a5ec) — 서버가 S3에 저장한 최종 object URL.
export const uploadFileResponseSchema = z.object({
  s3Url: z.string(),
});

interface UploadLimit {
  maxBytes: number;
  mimeTypes: readonly string[];
  /** accept 속성·안내 문구용 확장자 표기. */
  extensions: string;
}

const IMAGE_MIME = ["image/jpeg", "image/png"] as const;
const DOCUMENT_MIME = ["application/pdf", ...IMAGE_MIME] as const;

/** purpose별 허용 MIME·최대 용량(명세 단일 진실). 서버가 매직바이트까지 검증하므로 FE는 사전 안내용. */
export const UPLOAD_LIMITS: Record<UploadPurpose, UploadLimit> = {
  avatar: { maxBytes: 5 * 1024 * 1024, mimeTypes: IMAGE_MIME, extensions: "JPG·PNG" },
  report_document: { maxBytes: 20 * 1024 * 1024, mimeTypes: DOCUMENT_MIME, extensions: "PDF·JPG·PNG" },
  license: { maxBytes: 20 * 1024 * 1024, mimeTypes: DOCUMENT_MIME, extensions: "PDF·JPG·PNG" },
  registration: { maxBytes: 20 * 1024 * 1024, mimeTypes: DOCUMENT_MIME, extensions: "PDF·JPG·PNG" },
};

export function uploadAcceptAttr(purpose: UploadPurpose): string {
  return UPLOAD_LIMITS[purpose].mimeTypes.join(",");
}

/** 업로드 전 사전 검증 — 위반 시 안내 문구, 통과 시 null. */
export function validateUploadFile(file: File, purpose: UploadPurpose): string | null {
  const { maxBytes, mimeTypes, extensions } = UPLOAD_LIMITS[purpose];
  if (!mimeTypes.includes(file.type)) return `${extensions} 형식만 올릴 수 있어요.`;
  if (file.size === 0) return "빈 파일은 올릴 수 없어요.";
  if (file.size > maxBytes) return `최대 ${maxBytes / (1024 * 1024)}MB까지 올릴 수 있어요.`;
  return null;
}

// 업로드 완료 후 소비처에 노출하는 최종 URL(기존 계약 유지 — presign 2단계는 내부 구현으로 감춘다).
export const uploadResponseSchema = z.object({
  url: z.string(),
});

export type UploadResponse = z.infer<typeof uploadResponseSchema>;
