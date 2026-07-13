"use client";

import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { API_BASE_URL } from "./config";
import { fetchJson } from "./fetch-json";

// POST /uploads(report 도메인 공용) — multipart 단일 파일 업로드 → { url }.
// 기존 useUploadAvatar와 동일 엔드포인트지만 자격 서류 업로드용으로 분리 유지(범용 훅).
export const uploadFileResponseSchema = z.object({ url: z.string().url() });
export type UploadFileResponse = z.infer<typeof uploadFileResponseSchema>;

export function uploadFile(file: File): Promise<UploadFileResponse> {
  const formData = new FormData();
  formData.append("file", file);

  return fetchJson(`${API_BASE_URL}/uploads`, uploadFileResponseSchema, {
    method: "POST",
    body: formData,
  });
}

export function useUploadFile() {
  return useMutation({
    mutationFn: (file: File) => uploadFile(file),
  });
}
