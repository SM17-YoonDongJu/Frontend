"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import { Send } from "@/shared/ui/icons/Send";

export interface MessageInputBarProps {
  onSend: (content: string) => void;
  /** 일반 비활성(전송 중 등) */
  disabled?: boolean;
  /** CLOSED 방 — 입력·전송 차단 + 안내 문구 */
  closed?: boolean;
  /** 직전 전송 실패 — 롤백 후 재시도 안내 노출 */
  sendFailed?: boolean;
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

export function MessageInputBar({ onSend, disabled, closed, sendFailed }: MessageInputBarProps) {
  const [value, setValue] = useState("");
  const isMdUp = useIsMdUp();

  const trimmed = value.trim();
  const blocked = Boolean(disabled) || Boolean(closed);
  const canSend = trimmed.length > 0 && !blocked;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!canSend) return;
    onSend(trimmed);
    setValue("");
  };

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
    </div>
  );
}
