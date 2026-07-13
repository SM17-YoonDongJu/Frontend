"use client";

import { useRef } from "react";
import { Modal } from "@/shared/ui/Modal";
import { Camera } from "@/shared/ui/icons/Camera";
import { FileText } from "@/shared/ui/icons/FileText";
import { ImageIcon } from "@/shared/ui/icons/ImageIcon";

export interface AttachmentSheetProps {
  open: boolean;
  onPick: (file: File) => void;
  onClose: () => void;
}

/** 모바일 첨부 시트(Figma 663:3846 첨부 옵션) — 사진 촬영·갤러리·파일(이미지/PDF). */
export function AttachmentSheet({ open, onPick, onClose }: AttachmentSheetProps) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleChange = (input: HTMLInputElement | null) => {
    const file = input?.files?.[0];
    if (input) input.value = "";
    if (!file) return;
    onPick(file);
    onClose();
  };

  const options = [
    { label: "사진 촬영", icon: <Camera className="text-[1.125rem]" />, ref: cameraRef },
    { label: "갤러리", icon: <ImageIcon className="text-[1.125rem]" />, ref: galleryRef },
    { label: "파일", icon: <FileText className="text-[1.125rem]" />, ref: fileRef },
  ];

  return (
    <Modal open={open} title="파일 첨부" dismissible onClose={onClose} className="max-w-[22rem]">
      <ul className="flex flex-col gap-2">
        {options.map((option) => (
          <li key={option.label}>
            <button
              type="button"
              onClick={() => option.ref.current?.click()}
              className="flex w-full items-center gap-3 rounded-input bg-paper-2 px-4 py-3.5 text-[0.875rem] font-semibold text-ink transition hover:brightness-[.97]"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-card text-gold-ink">
                {option.icon}
              </span>
              {option.label}
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[0.71875rem] text-ink-3">
        진단서·증권 등 서류 전달 용도 · 이미지/PDF 지원
      </p>

      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={() => handleChange(cameraRef.current)}
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={() => handleChange(galleryRef.current)}
      />
      <input
        ref={fileRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={() => handleChange(fileRef.current)}
      />
    </Modal>
  );
}
