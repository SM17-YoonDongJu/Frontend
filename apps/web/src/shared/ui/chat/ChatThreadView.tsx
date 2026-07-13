"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/shared/api/chat/chat.schema";
import { ChevronDown } from "@/shared/ui/icons/ChevronDown";
import { DateDivider } from "./DateDivider";
import { formatDateDividerLabel, isSameDay } from "./format";
import { MessageBubble } from "./MessageBubble";

export interface ChatThreadViewProps {
  messages: ChatMessage[];
  /** mine/theirs 판별 기준 — senderId 문자열 비교 */
  currentUserId: string;
  /** 더 오래된 메시지가 남아 있는지(커서) — 상단 도달 시 loadOlder 호출 */
  hasOlder?: boolean;
  onLoadOlder?: () => void;
  loadingOlder?: boolean;
}

const NEAR_BOTTOM_PX = 80;

export function ChatThreadView({
  messages,
  currentUserId,
  hasOlder,
  onLoadOlder,
  loadingOlder,
}: ChatThreadViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const [showJump, setShowJump] = useState(false);

  // 직전 렌더의 첫/마지막 메시지 id — prepend(이전 대화)와 append(새 메시지)를 구분
  const edgeRef = useRef<{ firstId?: string; lastId?: string; scrollHeight: number }>({
    scrollHeight: 0,
  });

  const isNearBottom = () => {
    const el = scrollRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_BOTTOM_PX;
  };

  const scrollToBottom = (smooth = false) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
  };

  // 메시지 변화 처리 — prepend는 스크롤 위치 보존, append는 하단 스크롤 or 점프 버튼
  useLayoutEffect(() => {
    const el = scrollRef.current;
    const firstId = messages[0]?.messageId;
    const lastId = messages[messages.length - 1]?.messageId;
    const prev = edgeRef.current;

    if (el && prev.firstId && firstId !== prev.firstId && lastId === prev.lastId) {
      // 이전 대화 prepend — 보던 위치가 튀지 않게 늘어난 높이만큼 유지
      el.scrollTop += el.scrollHeight - prev.scrollHeight;
    } else if (prev.lastId && lastId !== prev.lastId) {
      // 새 메시지 append — 내 메시지거나 하단 근처면 따라가고, 위를 보는 중이면 점프 버튼
      const mine = messages[messages.length - 1]?.senderId === currentUserId;
      if (mine || isNearBottom()) scrollToBottom();
      else setShowJump(true);
    } else if (!prev.firstId) {
      // 최초 렌더(방 진입) — 하단으로
      scrollToBottom();
    }

    edgeRef.current = { firstId, lastId, scrollHeight: el?.scrollHeight ?? 0 };
  }, [messages, currentUserId]);

  // 상단 센티널 — 보이면 이전 대화 로드(무한 스크롤)
  useEffect(() => {
    const sentinel = topSentinelRef.current;
    const root = scrollRef.current;
    if (!sentinel || !root || !hasOlder || !onLoadOlder) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting) && !loadingOlder) {
          edgeRef.current.scrollHeight = root.scrollHeight;
          onLoadOlder();
        }
      },
      { root, rootMargin: "120px 0px 0px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasOlder, onLoadOlder, loadingOlder]);

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
    <div className="relative min-h-0 flex-1">
      <div
        ref={scrollRef}
        onScroll={() => {
          if (isNearBottom()) setShowJump(false);
        }}
        className="h-full overflow-y-auto px-4 py-4"
      >
        {hasOlder && (
          <div ref={topSentinelRef} className="flex justify-center pb-2">
            <span className="text-[0.71875rem] text-ink-3" aria-live="polite">
              {loadingOlder ? "이전 대화를 불러오는 중…" : "위로 스크롤해 이전 대화 보기"}
            </span>
          </div>
        )}
        <div className="flex flex-col gap-2.5">
          {messages.map((message, index) => {
            const previous = messages[index - 1];
            const showDivider =
              !previous || !isSameDay(previous.createdAt, message.createdAt);

            return (
              <Fragment key={message.messageId}>
                {showDivider && (
                  <DateDivider label={formatDateDividerLabel(message.createdAt)} />
                )}
                <MessageBubble
                  content={message.content}
                  createdAt={message.createdAt}
                  mine={message.senderId === currentUserId}
                  attachments={message.attachments}
                />
              </Fragment>
            );
          })}
        </div>
      </div>

      {showJump && (
        <button
          type="button"
          onClick={() => {
            scrollToBottom(true);
            setShowJump(false);
          }}
          className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border border-line bg-card px-3.5 py-1.5 text-[0.75rem] font-semibold text-ink shadow-[0px_2px_8px_rgba(21,32,46,0.12)] transition hover:bg-paper-2"
        >
          새 메시지
          <ChevronDown className="text-[0.875rem]" />
        </button>
      )}
    </div>
  );
}
