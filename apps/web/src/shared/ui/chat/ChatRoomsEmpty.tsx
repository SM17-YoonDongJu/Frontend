import Link from "next/link";
import { ChatBubble } from "@/shared/ui/icons/ChatBubble";
import { Search } from "@/shared/ui/icons/Search";

/** 대화가 없을 때 안내 CTA(역할별) — customer는 손해사정사 찾기로 이동, partner는 없음 */
export interface ChatEmptyAction {
  href: string;
  label: string;
}

/** 대화 없음 빈 상태 (Figma 916:23603) — 말풍선 일러스트 + 안내 + 역할별 CTA */
export function ChatRoomsEmpty({ action }: { action?: ChatEmptyAction }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 pb-16 text-center">
      {/* 두 말풍선 일러스트 — 뒤 회색(점 3개) + 앞 골드 */}
      <div className="relative h-[4.875rem] w-[7.5rem]" aria-hidden>
        <div className="absolute left-[0.375rem] top-5 flex h-[3.625rem] w-[4.625rem] items-center justify-center gap-1 rounded-[1.125rem] rounded-bl-[0.25rem] border border-line bg-card shadow-raised">
          <span className="size-1.5 rounded-[0.1875rem] bg-line" />
          <span className="size-1.5 rounded-[0.1875rem] bg-line" />
          <span className="size-1.5 rounded-[0.1875rem] bg-line" />
        </div>
        <div className="absolute left-[3.625rem] top-0 flex h-[2.875rem] w-[3.625rem] items-center justify-center rounded-[1rem] rounded-br-[0.25rem] border border-gold-2 bg-gold-soft">
          <ChatBubble className="text-[1.25rem] text-gold-ink" />
        </div>
      </div>

      <p className="mt-6 text-[1rem] font-bold text-ink">아직 진행 중인 대화가 없어요</p>
      <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-2">
        사정사에게 상담을 신청하거나 받은 제안을 수락하면
        <br />
        여기서 대화가 시작돼요.
      </p>

      {action && (
        <Link
          href={action.href}
          className="mt-5 inline-flex items-center gap-1.5 rounded-button bg-paper px-4 py-2 text-[0.8125rem] font-bold text-ink transition hover:brightness-[.97]"
        >
          {action.label}
          <Search className="text-[0.9375rem] text-ink-3" />
        </Link>
      )}
    </div>
  );
}
