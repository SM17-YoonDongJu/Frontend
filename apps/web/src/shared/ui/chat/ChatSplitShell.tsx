import { cn } from "@/shared/lib/utils";
import type { ReactNode } from "react";

export interface ChatSplitShellProps {
  list: ReactNode;
  main: ReactNode;
  /**
   * list  — 목록 페이지: 모바일은 목록만, md+는 목록 + main(빈 안내) 병렬
   * thread — 스레드 페이지: 모바일은 스레드만, md+는 목록 병렬 + 스레드
   */
  variant: "list" | "thread";
}

export function ChatSplitShell({ list, main, variant }: ChatSplitShellProps) {
  return (
    /* Figma 95:4572 — max 1080px, 목록 320px 흰 패널 + 스레드 paper-2 분할 카드 */
    <section className="mx-auto max-w-[67.5rem] px-4 py-6 md:px-10">
      <div className="flex h-[calc(100dvh-9rem)] min-h-[32rem] overflow-hidden rounded-card border border-line bg-paper">
        <div
          className={cn(
            "w-full shrink-0 border-line-2 md:w-80 md:border-r md:bg-card",
            variant === "thread" && "hidden md:block",
          )}
        >
          {list}
        </div>
        <div
          className={cn(
            "min-w-0 flex-1 bg-paper md:bg-paper-2",
            variant === "list" && "hidden md:flex md:flex-col",
          )}
        >
          {main}
        </div>
      </div>
    </section>
  );
}

/** md+ 목록 페이지 우측 — 대화 미선택 빈 패널 */
export function ChatEmptyPane() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <p className="text-[0.9375rem] font-semibold text-ink">대화를 선택하세요</p>
      <p className="mt-1.5 text-[0.8125rem] text-ink-3">
        왼쪽 목록에서 상담을 선택하면 대화가 열려요.
      </p>
    </div>
  );
}
