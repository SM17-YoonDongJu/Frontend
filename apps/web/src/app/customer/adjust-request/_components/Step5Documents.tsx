"use client";

import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useUploadDocument } from "../_api/use-upload-document";
import type { AdjustRequestDraft } from "../_model/types";
import { FileDropzone } from "./FileDropzone";
import { UploadFileItem, type UploadStatus } from "./UploadFileItem";

const ACCEPT = ".pdf,.jpg,.jpeg,.png";
const ACCEPT_MIME = ["application/pdf", "image/jpeg", "image/png"];
const MAX_SIZE = 20 * 1024 * 1024;

interface UploadItem {
  id: string;
  file: File;
  status: UploadStatus;
  url?: string;
  error?: string;
  previewUrl?: string;
}

export function Step5Documents() {
  const { setValue } = useFormContext<AdjustRequestDraft>();
  const upload = useUploadDocument();
  const [items, setItems] = useState<UploadItem[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);
  const mounted = useRef(false);

  // 완료된 파일 url만 폼에 반영. 첫 렌더(items 빈 상태)는 건너뛰어
  // 복원된 documentUrls 덮어쓰기 방지. (File은 복원 불가 → items는 빈 채 시작)
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const urls = items.filter((i) => i.status === "done" && i.url).map((i) => i.url as string);
    setValue("documentUrls", urls.length ? urls : null);
  }, [items, setValue]);

  const startUpload = (item: UploadItem) => {
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: "uploading", error: undefined } : i)),
    );
    upload.mutate(item.file, {
      onSuccess: (data) =>
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: "done", url: data.url } : i)),
        ),
      onError: (e) =>
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: "error", error: e.message } : i)),
        ),
    });
  };

  const addFiles = (files: File[]) => {
    const valid: File[] = [];
    const bad: string[] = [];
    for (const f of files) {
      if (!ACCEPT_MIME.includes(f.type) || f.size > MAX_SIZE) bad.push(f.name);
      else valid.push(f);
    }
    setRejected(bad);

    const newItems: UploadItem[] = valid.map((f) => ({
      id: crypto.randomUUID(),
      file: f,
      status: "uploading",
      previewUrl: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined,
    }));
    setItems((prev) => [...prev, ...newItems]);
    newItems.forEach(startUpload);
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  return (
    <section className="flex flex-col gap-5">
      <div>
        <h2 className="font-serif text-[1.5625rem] font-bold text-ink sm:text-[1.375rem]">
          관련 서류를 올려주세요
        </h2>
        <p className="mt-1.5 text-[0.84375rem] text-ink-3">
          진단서·보험증권·지급결과서 (사진/PDF, 최대 20MB)
        </p>
      </div>

      <FileDropzone onFiles={addFiles} accept={ACCEPT} />

      {rejected.length > 0 && (
        <p className="text-[0.78125rem] text-terra">
          업로드 불가(형식·용량): {rejected.join(", ")}
        </p>
      )}

      {items.length > 0 && (
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <UploadFileItem
              key={item.id}
              name={item.file.name}
              size={item.file.size}
              status={item.status}
              previewUrl={item.previewUrl}
              errorMessage={item.error}
              onRetry={() => startUpload(item)}
              onRemove={() => removeItem(item.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
