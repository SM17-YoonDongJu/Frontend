"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { Plus } from "@/shared/ui/icons/Plus";
import { Send } from "@/shared/ui/icons/Send";
import { Upload } from "@/shared/ui/icons/Upload";
import { AttachmentSheet } from "./AttachmentSheet";

export interface MessageInputBarProps {
  onSend: (content: string) => void;
  /** 일반 비활성(전송 중 등) */
  disabled?: boolean;
  /** CLOSED 방 — 입력·전송 차단 + 안내 문구 */
  closed?: boolean;
  /** 직전 전송 실패 — 롤백 후 재시도 안내 노출 */
  sendFailed?: boolean;
  /** 파일 첨부(⚠️ 명세없음-초안) — 미전달 시 첨부 버튼 미노출 */
  onPickFile?: (file: File) => void;
  attachPending?: boolean;
}

const MD_QUERY = "(min-width: 768px)";

function subscribeMd(onChange: () => void) {
  const mql = window.matchMedia(MD_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

/** Figma 문구가 브레이크포인트별로 다름 — 모바일 "메시지 입력…"(663:3842) · 데스크톱 "메시지를 입력하세요"(95:4639) */
function useIsMdUp() {
  return useSyncExternalStore(
    subscribeMd,
    () => window.matchMedia(MD_QUERY).matches,
    () => false,
  );
}

export function MessageInputBar({
  onSend,
  disabled,
  closed,
  sendFailed,
  onPickFile,
  attachPending,
}: MessageInputBarProps) {
  const [value, setValue] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const isMdUp = useIsMdUp();
  // 직전 전송 내용 — 실패(롤백) 시 입력창에 복원해 바로 재시도할 수 있게
  const lastSentRef = useRef("");
  // 데스크톱 ↑ 버튼은 시트 없이 파일 선택을 바로 연다(Figma 95:4635)
  const desktopFileRef = useRef<HTMLInputElement>(null);

  const trimmed = value.trim();
  const blocked = Boolean(disabled) || Boolean(closed);
  const canSend = trimmed.length > 0 && !blocked;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!canSend) return;
    lastSentRef.current = trimmed;
    onSend(trimmed);
    setValue("");
  };

  useEffect(() => {
    if (!sendFailed || !lastSentRef.current) return;
    // 사용자가 새로 입력 중이면 덮어쓰지 않는다
    setValue((current) => (current === "" ? lastSentRef.current : current));
  }, [sendFailed]);

  if (closed) {
    // 종료된 방 — 입력·전송을 회색 비활성으로 잠금(문구는 placeholder로 안내)
    return (
      <div className="flex items-center gap-2.5 border-t border-line-2 bg-paper-2 px-4 py-3 md:bg-transparent md:pb-4">
        <input
          type="text"
          value=""
          disabled
          readOnly
          placeholder="종료된 상담이에요. 새 메시지를 보낼 수 없어요."
          aria-label="메시지 입력"
          className="h-11 flex-1 cursor-not-allowed rounded-full border border-line-2 bg-paper-2 px-4 text-[0.85rem] placeholder:text-ink-3 md:h-[2.625rem] md:rounded-input"
        />
        <button
          type="button"
          disabled
          aria-label="전송"
          className="flex size-11 shrink-0 cursor-not-allowed items-center justify-center rounded-full bg-line-2 text-[1.25rem] text-ink-3 md:size-[2.625rem] md:rounded-input md:text-[1.0625rem]"
        >
          <Send />
        </button>
      </div>
    );
  }

  return (
    <div className="border-t border-line-2 bg-paper md:border-0 md:bg-transparent">
      {sendFailed && (
        <p role="alert" className="px-4 pt-2 text-[0.75rem] text-terra">
          메시지를 보내지 못했어요. 다시 시도해 주세요.
        </p>
      )}
    <form
      onSubmit={submit}
      className="flex items-center gap-2.5 px-4 py-3 md:pb-4"
    >
      {onPickFile && (
        <>
          {/* 첨부 — 모바일 + 원형(663:3846, 시트 열기) · 데스크톱 ↑ 사각(95:4635, 바로 파일 선택) */}
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            disabled={disabled || attachPending}
            aria-label="파일 첨부"
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-line bg-card text-[1.125rem] text-ink transition hover:bg-paper-2 disabled:cursor-not-allowed disabled:opacity-[.42] md:hidden"
          >
            <Plus />
          </button>
          <button
            type="button"
            onClick={() => desktopFileRef.current?.click()}
            disabled={disabled || attachPending}
            aria-label="파일 첨부"
            className="hidden size-[2.625rem] shrink-0 items-center justify-center rounded-input border border-line bg-card text-[1.125rem] text-ink transition hover:bg-paper-2 disabled:cursor-not-allowed disabled:opacity-[.42] md:flex"
          >
            <Upload />
          </button>
          <input
            ref={desktopFileRef}
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={() => {
              const file = desktopFileRef.current?.files?.[0];
              if (desktopFileRef.current) desktopFileRef.current.value = "";
              if (file) onPickFile(file);
            }}
          />
        </>
      )}
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        disabled={disabled}
        placeholder={isMdUp ? "메시지를 입력하세요" : "메시지 입력…"}
        suppressHydrationWarning
        aria-label="메시지 입력"
        className="h-11 flex-1 rounded-full border border-line bg-card px-4 text-[0.85rem] text-ink outline-none transition placeholder:text-ink-3 focus:border-gold focus:ring-[3px] focus:ring-gold-soft disabled:opacity-[.42] md:h-[2.625rem] md:rounded-input"
      />
      {/* 전송 버튼 — 모바일 골드 원형(663:3843) · 데스크톱 네이비 사각(95:4640) */}
      <button
        type="submit"
        disabled={!canSend}
        aria-label="전송"
        className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gold text-[1.25rem] text-white transition hover:brightness-[.96] disabled:cursor-not-allowed disabled:opacity-[.42] md:size-[2.625rem] md:rounded-input md:bg-navy md:text-[1.0625rem] md:text-gold-2"
      >
        <Send />
      </button>
    </form>

      {onPickFile && (
        <AttachmentSheet
          open={sheetOpen}
          onPick={onPickFile}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </div>
  );
}
