"use client";

import { Fragment, useEffect, useRef } from "react";
import type { ChatMessage } from "@/shared/api/chat/chat.schema";
import { DateDivider } from "./DateDivider";
import { formatDateDividerLabel, isSameDay } from "./format";
import { MessageBubble } from "./MessageBubble";

export interface ChatThreadViewProps {
  messages: ChatMessage[];
  /** mine/theirs 판별 기준 — senderId 문자열 비교 */
  currentUserId: string;
}

export function ChatThreadView({ messages, currentUserId }: ChatThreadViewProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
    // 배열 참조 기준 — 개수가 같아도 방 전환 시 하단 스크롤이 다시 실행되도록
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-[0.9375rem] font-semibold text-ink">새로운 상담이에요</p>
        <p className="mt-1.5 text-[0.8125rem] text-ink-3">
          첫 메시지를 보내 상담을 시작해 보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      <div className="flex flex-col gap-2.5">
        {messages.map((message, index) => {
          const previous = messages[index - 1];
          const showDivider = !previous || !isSameDay(previous.createdAt, message.createdAt);

          return (
            <Fragment key={message.messageId}>
              {showDivider && <DateDivider label={formatDateDividerLabel(message.createdAt)} />}
              <MessageBubble
                content={message.content}
                createdAt={message.createdAt}
                mine={message.senderId === currentUserId}
              />
            </Fragment>
          );
        })}
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
