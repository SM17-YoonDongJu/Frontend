"use client";

import { useCallback, useState } from "react";
import { useUploadFile } from "@/shared/api/use-upload-file";
import type { UploadPurpose } from "@/shared/model/upload.schema";
import type { FileUploadStatus } from "@/shared/ui/FileUploadField";

const MAX_SIZE_MB = 20;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ALLOWED_PREFIXES = ["application/pdf", "image/"];

function formatSize(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)}MB` : `${Math.max(1, Math.round(bytes / 1024))}KB`;
}

function validate(file: File): string | null {
  const typeOk = ALLOWED_PREFIXES.some((prefix) => file.type.startsWith(prefix));
  if (!typeOk) return "PDF 또는 이미지 파일만 올릴 수 있어요.";
  if (file.size > MAX_SIZE_BYTES) return `파일당 최대 ${MAX_SIZE_MB}MB까지 올릴 수 있어요.`;
  return null;
}

export interface DocumentUpload {
  status: FileUploadStatus;
  /** 업로드 완료 URL(신청 body에 채움). 없으면 undefined. */
  url?: string;
  /** 완료 표시용 "파일명 · 크기" */
  fileName?: string;
  errorMessage?: string;
  select: (file: File) => void;
  /** 로컬 draft URL로 완료 상태 복원(재제출 프리필). */
  restore: (url: string, fileName?: string) => void;
}

/** 단일 서류 업로드 상태 관리 — 크기·형식 검증 후 POST /uploads(useUploadFile). */
export function useDocumentUpload(purpose: UploadPurpose): DocumentUpload {
  const upload = useUploadFile(purpose);
  const [status, setStatus] = useState<FileUploadStatus>("idle");
  const [url, setUrl] = useState<string>();
  const [fileName, setFileName] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const select = useCallback(
    (file: File) => {
      if (upload.isPending) return;
      const invalid = validate(file);
      if (invalid) {
        setStatus("error");
        setErrorMessage(invalid);
        return;
      }
      const displayName = `${file.name} · ${formatSize(file.size)}`;
      setStatus("uploading");
      setErrorMessage(undefined);
      setUrl(undefined);
      setFileName(undefined);
      upload.mutate(file, {
        onSuccess: (data) => {
          setUrl(data.url);
          setFileName(displayName);
          setStatus("done");
        },
        onError: () => {
          setStatus("error");
          setErrorMessage("업로드에 실패했어요. 다시 시도해 주세요.");
        },
      });
    },
    [upload],
  );

  const restore = useCallback((restoredUrl: string, restoredName?: string) => {
    setUrl(restoredUrl);
    setFileName(restoredName);
    setStatus("done");
  }, []);

  return { status, url, fileName, errorMessage, select, restore };
}
