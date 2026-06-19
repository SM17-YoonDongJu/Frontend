"use client";

import { useRef, useState } from "react";
import { cn } from "@/shared/lib/utils";

interface FileDropzoneProps {
  onFiles: (files: File[]) => void;
  accept: string;
}

/** drag&drop + 클릭 업로드 영역. */
export function FileDropzone({ onFiles, accept }: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const pick = (list: FileList | null) => {
    if (list && list.length) onFiles(Array.from(list));
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        pick(e.dataTransfer.files);
      }}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed py-10 text-center transition",
        dragOver ? "border-gold bg-gold-soft" : "border-line bg-paper-2 hover:border-gold-2",
      )}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-ink-3">
        <path d="M12 16V4m0 0 4 4m-4-4-4 4M5 18v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p className="text-[14px] font-semibold text-ink">파일을 끌어다 놓거나 클릭해 업로드</p>
      <p className="text-[12px] text-ink-3">PDF, JPG, PNG · 최대 20MB</p>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept}
        className="hidden"
        onChange={(e) => {
          pick(e.target.files);
          e.target.value = ""; // 같은 파일 재선택 허용
        }}
      />
    </div>
  );
}
