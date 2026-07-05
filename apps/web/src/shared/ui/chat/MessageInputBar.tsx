"use client";

import { useState, type FormEvent } from "react";
import { Send } from "@/shared/ui/icons/Send";

export interface MessageInputBarProps {
  onSend: (content: string) => void;
  /** 일반 비활성(전송 중 등) */
  disabled?: boolean;
  /** CLOSED 방 — 입력·전송 차단 + 안내 문구 */
  closed?: boolean;
}

export function MessageInputBar({ onSend, disabled, closed }: MessageInputBarProps) {
  const [value, setValue] = useState("");

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
    return (
      <div className="border-t border-line-2 bg-paper-2 px-4 py-4 text-center text-[0.8125rem] text-ink-3">
        종료된 상담이에요. 새 메시지를 보낼 수 없어요.
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="flex items-center gap-2.5 border-t border-line-2 bg-paper px-4 py-3"
    >
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        disabled={disabled}
        placeholder="메시지 입력…"
        aria-label="메시지 입력"
        className="h-11 flex-1 rounded-full border border-line bg-card px-4 text-[0.85rem] text-ink outline-none transition placeholder:text-ink-3 focus:border-gold focus:ring-[3px] focus:ring-gold-soft disabled:opacity-[.42]"
      />
      <button
        type="submit"
        disabled={!canSend}
        aria-label="전송"
        className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gold text-[1.25rem] text-white transition hover:brightness-[.96] disabled:cursor-not-allowed disabled:opacity-[.42]"
      >
        <Send />
      </button>
    </form>
  );
}
