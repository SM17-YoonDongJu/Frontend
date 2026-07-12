import { z } from "zod";

// POST /uploads 응답 — S3 저장 결과 URL(사전 §5). avatar·문서 공통.
export const uploadResponseSchema = z.object({
  url: z.string(),
});

export type UploadResponse = z.infer<typeof uploadResponseSchema>;
