"use client";

import { useEffect, useRef, useState } from "react";
import { getInitial } from "@/shared/lib/initial";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/Button";
import { Pencil } from "@/shared/ui/icons/Pencil";
import { uploadErrorMessage } from "@/shared/api/upload-file";
import {
  UPLOAD_LIMITS,
  uploadAcceptAttr,
  validateUploadFile,
} from "@/shared/model/upload.schema";
import { useUploadAvatar } from "../_api/use-upload-avatar";

interface AvatarUploaderProps {
  value: string | null;
  onChange: (url: string | null) => void;
  onUploadingChange?: (uploading: boolean) => void;
  nickname: string;
}

const ACCEPT_ATTR = uploadAcceptAttr("avatar");
const MAX_MB = UPLOAD_LIMITS.avatar.maxBytes / (1024 * 1024);

export function AvatarUploader({ value, onChange, onUploadingChange, nickname }: AvatarUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadAvatar = useUploadAvatar();
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onUploadingChange?.(uploadAvatar.isPending);
  }, [uploadAvatar.isPending, onUploadingChange]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  async function handleFile(file: File) {
    const validationError = validateUploadFile(file, "avatar");
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    try {
      const { url } = await uploadAvatar.mutateAsync(file);
      onChange(url);
      setPreview(null);
    } catch (uploadError) {
      setError(uploadErrorMessage(uploadError));
      setPreview(null);
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  }

  const shownImage = preview ?? value;
  const initial = getInitial(nickname);

  return (
    <div className="flex flex-col items-center gap-2 lg:items-stretch">
      <div className="flex flex-col items-center gap-4 lg:flex-row">
        <div className="relative">
          <div className="flex size-[4.875rem] items-center justify-center overflow-hidden rounded-full bg-navy text-[2rem] font-bold text-white lg:size-[3.5rem] lg:bg-ink lg:text-[1.25rem]">
            {shownImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={shownImage} alt="프로필 사진 미리보기" className="size-full object-cover" />
            ) : (
              initial
            )}
          </div>
          <button
            type="button"
            aria-label="사진 변경"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-0 right-0 flex size-7 items-center justify-center rounded-full border-2 border-paper bg-gold text-white transition hover:brightness-[.96] lg:hidden"
          >
            <Pencil className="text-[0.875rem]" />
          </button>
        </div>

        <div className="hidden flex-col gap-1 lg:flex">
          <Button
            variant="outline"
            size="sm"
            loading={uploadAvatar.isPending}
            onClick={() => inputRef.current?.click()}
            icon={
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M12 16V4m0 0 4 4m-4-4-4 4M5 18v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
          >
            사진 변경
          </Button>
          <span className="text-[0.75rem] text-ink-3">정면 얼굴 사진 권장 · {MAX_MB}MB 이하</span>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_ATTR}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </div>

      {error && (
        <span className={cn("text-[0.75rem] font-medium text-terra")} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
