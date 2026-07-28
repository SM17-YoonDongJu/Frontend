import { z } from "zod";

// 업로드 용도 — 백엔드 UploadPurpose(키 prefix·MIME 화이트리스트를 용도별로 소유).
export const uploadPurposeSchema = z.enum([
  "report_document",
  "license",
  "registration",
  "avatar",
]);
export type UploadPurpose = z.infer<typeof uploadPurposeSchema>;

// POST /uploads 응답(백엔드 PresignedUploadResponse) — presigned PUT URL 발급.
export const presignedUploadResponseSchema = z.object({
  uploadUrl: z.string(),
  s3Url: z.string(),
});
export type PresignedUploadResponse = z.infer<typeof presignedUploadResponseSchema>;

// 업로드 완료 후 소비처에 노출하는 최종 URL(기존 계약 유지 — presign 2단계는 내부 구현으로 감춘다).
export const uploadResponseSchema = z.object({
  url: z.string(),
});

export type UploadResponse = z.infer<typeof uploadResponseSchema>;
