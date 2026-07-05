import { cn } from "@/shared/lib/utils";
import { formatMessageTime } from "./format";

export interface MessageBubbleProps {
  content: string;
  createdAt: string;
  /** 내 메시지 여부 — true면 네이비 우측, false면 카드 좌측. 판별은 부모 책임 */
  mine: boolean;
}

export function MessageBubble({ content, createdAt, mine }: MessageBubbleProps) {
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
      </div>
      <time className="px-1 text-[0.6875rem] text-ink-3">
        {formatMessageTime(createdAt)}
      </time>
    </div>
  );
}
