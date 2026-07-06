"use client";

import { useRef, useState } from "react";
import { cn } from "@/shared/lib/utils";
import { Upload } from "@/shared/ui/icons/Upload";

interface FileDropzoneProps {
  onFiles: (files: File[]) => void;
  accept: string;
}

/** 파일 추가 영역. 모바일=탭(촬영·갤러리·파일 선택), 데스크톱=클릭·드래그. */
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
        "flex cursor-pointer flex-col items-center justify-center gap-2.5 rounded-card border py-8 text-center transition",
        dragOver ? "border-gold bg-gold-soft" : "border-line bg-paper-2 hover:border-gold-2",
      )}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-input border border-line bg-card text-ink-3">
        <Upload className="text-[1.4375rem]" />
      </span>
      <p className="text-[0.875rem] font-bold text-ink">파일 추가</p>
      <p className="text-[0.75rem] text-ink-3">
        <span className="sm:hidden">촬영 · 갤러리 · 파일 선택</span>
        <span className="hidden sm:inline">끌어다 놓거나 클릭해 업로드 · PDF, JPG, PNG</span>
      </p>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept}
        className="hidden"
        onChange={(e) => {
          pick(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
