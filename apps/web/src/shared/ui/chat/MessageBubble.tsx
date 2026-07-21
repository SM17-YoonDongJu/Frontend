import type { MessageAttachment } from "@/shared/api/chat/chat.schema";
import { cn } from "@/shared/lib/utils";
import { FileText } from "@/shared/ui/icons/FileText";
import { formatMessageTime } from "./format";

export interface MessageBubbleProps {
  content: string | null;
  createdAt: string;
  /** 내 메시지 여부 — true면 네이비 우측, false면 카드 좌측. 판별은 부모 책임 */
  mine: boolean;
  /** 첨부 파일 — 파일명 칩으로 표시(없으면 null) */
  attachment?: MessageAttachment | null;
}

export function MessageBubble({ content, createdAt, mine, attachment }: MessageBubbleProps) {
  return (
    <div className={cn("flex flex-col gap-1", mine ? "items-end" : "items-start")}>
      <div
        className={cn(
          "max-w-[19.5rem] whitespace-pre-wrap break-words rounded-[0.9375rem] px-3.5 py-2.5 text-[0.825rem] leading-relaxed",
          mine
            ? "rounded-br-[0.25rem] bg-navy text-white"
            : "rounded-bl-[0.25rem] border border-line bg-card text-ink",
        )}
      >
        {content}
        {attachment && (
          <div className={cn("flex flex-col gap-1.5", content && "mt-2")}>
            <span
              className={cn(
                "flex min-w-0 items-center gap-1.5 rounded-input px-2.5 py-2 text-[0.775rem] font-semibold",
                mine ? "bg-white/10 text-white" : "bg-paper-2 text-ink",
              )}
            >
              <FileText className="shrink-0 text-[1rem]" />
              <span className="truncate">{attachment.name}</span>
            </span>
          </div>
        )}
      </div>
      {/* Figma 모바일(663:3796)엔 말풍선 시각 없음 — 데스크톱(95:4571)만 표시 */}
      <time className="hidden px-1 text-[0.6875rem] text-ink-3 md:block">
        {formatMessageTime(createdAt)}
      </time>
    </div>
  );
}
