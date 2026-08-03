"use client";

import { useId, useRef, useState, type DragEvent } from "react";
import { cn } from "@/shared/lib/utils";
import { uploadAcceptAttr } from "@/shared/model/upload.schema";
import { Check } from "@/shared/ui/icons/Check";
import { FileText } from "@/shared/ui/icons/FileText";
import { Spinner } from "@/shared/ui/icons/Spinner";
import { Upload } from "@/shared/ui/icons/Upload";

export type FileUploadStatus = "idle" | "uploading" | "done" | "error";

export interface FileUploadFieldProps {
  /** 서류명 (예: 자격증 사본) */
  label: string;
  /** 보조 설명 (예: 신체손해사정사 자격증 (PDF/이미지)) */
  description?: string;
  status: FileUploadStatus;
  /** 완료 시 표시할 파일명 (설명 대신 노출) */
  fileName?: string;
  /** 에러 상태 안내 문구 */
  errorMessage?: string;
  /** accept 속성 (기본 PDF/이미지) */
  accept?: string;
  /** 파일 선택·드롭 시 호출. 크기·형식 검증은 소비처가 담당한다. */
  onSelectFile: (file: File) => void;
  id?: string;
  className?: string;
}

const ACCEPT_DEFAULT = uploadAcceptAttr("license");

/**
 * 자격 서류 업로드 필드(프레젠테이셔널). Drag&Drop + 파일 선택.
 * 업로드 상태(idle/uploading/done/error)와 문구는 소비처가 제어한다.
 */
export function FileUploadField({
  label,
  description,
  status,
  fileName,
  errorMessage,
  accept = ACCEPT_DEFAULT,
  onSelectFile,
  id,
  className,
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [dragOver, setDragOver] = useState(false);

  const isDone = status === "done";
  const isUploading = status === "uploading";
  const isError = status === "error";

  const openPicker = () => inputRef.current?.click();

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    if (isUploading) return;
    const file = event.dataTransfer.files?.[0];
    if (file) onSelectFile(file);
  };

  const surface = isDone
    ? "border-solid border-line bg-card"
    : isError
      ? "border-solid border-terra bg-terra-soft/40"
      : "border-dashed border-line bg-paper-2";
  const iconBox = isDone ? "bg-green-soft text-green" : "bg-gold-soft text-gold-ink";
  const descriptionText = isDone && fileName ? fileName : description;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          if (!isUploading) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "flex min-h-[2.75rem] items-center gap-3.5 rounded-input border px-[1.125rem] py-4 transition",
          surface,
          dragOver && "border-gold ring-3 ring-gold-soft",
        )}
      >
        <span
          className={cn(
            "flex size-[2.625rem] shrink-0 items-center justify-center rounded-button text-[1.25rem]",
            iconBox,
          )}
        >
          {isDone ? <FileText /> : <Upload />}
        </span>

        <div className="min-w-0 flex-1">
          <label
            htmlFor={inputId}
            className="block cursor-pointer break-keep text-[0.90625rem] font-bold text-ink"
          >
            {label}
          </label>
          {descriptionText && (
            <p className="mt-0.5 truncate text-[0.78125rem] text-ink-3">{descriptionText}</p>
          )}
        </div>

        {isDone ? (
          <span className="flex shrink-0 items-center gap-1.5 text-[0.78125rem] font-bold text-green">
            <Check className="text-[1rem]" />
            업로드됨
          </span>
        ) : isUploading ? (
          <span className="flex shrink-0 items-center gap-1.5 text-[0.78125rem] font-semibold text-ink-3">
            <Spinner />
            업로드 중
          </span>
        ) : (
          <button
            type="button"
            onClick={openPicker}
            aria-label={`${label} ${isError ? "다시 올리기" : "업로드"}`}
            className="flex shrink-0 items-center gap-1.5 rounded-button border border-line bg-card px-[0.9375rem] py-2.5 text-[0.84375rem] font-semibold text-ink transition hover:bg-paper"
          >
            {isError ? "다시 시도" : "업로드"}
            <Upload className="text-[1rem]" />
          </button>
        )}

        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          aria-label={`${label} 파일 선택`}
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onSelectFile(file);
            event.target.value = "";
          }}
        />
      </div>

      {isError && errorMessage && (
        <p className="text-[0.75rem] font-medium text-terra">{errorMessage}</p>
      )}
    </div>
  );
}
