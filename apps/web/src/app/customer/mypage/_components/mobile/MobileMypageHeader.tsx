import Link from "next/link";
import { Bell } from "@/shared/ui/icons/Bell";

/** 모바일 헤더 — 오버라인 + H1 + 알림 벨. */
export function MobileMypageHeader() {
  return (
    <header className="flex items-start justify-between pt-2.5">
      <div>
        <p className="text-[0.8125rem] font-bold text-gold-ink">마이페이지</p>
        <h1 className="mt-1 font-serif text-[1.625rem] font-bold text-ink">내 정보</h1>
      </div>
      <Link
        href="/notifications"
        aria-label="알림"
        className="flex size-10 items-center justify-center rounded-full text-ink-2 transition hover:bg-paper-2"
      >
        <Bell className="size-[1.1875rem]" />
      </Link>
    </header>
  );
}
