import Link from "next/link";
import type { ReactNode } from "react";
import type { RoomStatus } from "@/shared/api/chat/chat.schema";
import { Avatar } from "@/shared/ui/Avatar";
import { ChevronRight } from "@/shared/ui/icons/ChevronRight";
import { FileText } from "@/shared/ui/icons/FileText";
import { ShieldCheck } from "@/shared/ui/icons/ShieldCheck";
import { X } from "@/shared/ui/icons/X";
import { ROOM_STATUS_META } from "./room-status";

export interface ChatThreadHeaderProps {
  name: string;
  caseNo: string;
  roomStatus: RoomStatus;
  reportHref: string;
  /** 모바일 뒤로가기 — 없으면 버튼 미노출 */
  onBack?: () => void;
  /** 이름 옆 배지(매칭 완료 등). 없으면 미표시 */
  badge?: ReactNode;
  /** 서브타이틀 오버라이드. 없으면 기존 caseNo·roomStatus 라벨 */
  subtitle?: string;
  /** 우측 액션 슬롯(데스크톱). 리포트 보기 다음에 붙는다(customer 매칭 버튼 등) */
  actions?: ReactNode;
  /** 상담 종료(데스크톱 전용 버튼, partner 하위호환). ACTIVE 방에서만 노출 */
  onClose?: () => void;
  closePending?: boolean;
}

export function ChatThreadHeader({
  name,
  caseNo,
  roomStatus,
  reportHref,
  onBack,
  badge,
  subtitle: subtitleOverride,
  actions,
  onClose,
  closePending,
}: ChatThreadHeaderProps) {
  const subtitle =
    subtitleOverride ?? `${caseNo} · ${ROOM_STATUS_META[roomStatus].label}`;

  return (
    <header className="flex items-center gap-2.5 border-b border-line-2 bg-paper px-4 py-3 md:bg-card md:px-5">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="목록으로"
          className="-ml-1 flex size-8 items-center justify-center rounded-full text-[1.25rem] text-ink transition hover:bg-paper-2 md:hidden"
        >
          {/* Figma 663:3801 — 얇은 좌측 셰브런 */}
          <ChevronRight className="rotate-180" />
        </button>
      )}

      <Avatar name={name} size="sm" />

      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 truncate text-[0.85rem] font-bold text-ink">
          {name}
          {/* Figma 95:4611 — 이름 옆 인증 마크 */}
          <ShieldCheck className="shrink-0 text-[0.8125rem] text-ink-3" />
          {badge}
        </p>
        {/* Figma 모바일(663:3796) 헤더는 이름만 — 사건번호·상태는 데스크톱(95:4571) 전용 */}
        <p className="hidden truncate text-[0.6875rem] text-ink-3 md:block">{subtitle}</p>
        <span className="sr-only md:hidden">{subtitle}</span>
      </div>

      {/* 모바일 — 맨 아이콘(Figma 663:3811). 접근성 이름은 데스크톱 버튼과 동일("리포트 보기") */}
      <Link
        href={reportHref}
        aria-label="리포트 보기"
        className="flex size-9 items-center justify-center rounded-button text-[1.1875rem] text-ink transition hover:bg-paper-2 md:hidden"
      >
        <FileText />
      </Link>

      {/* 데스크톱 — 리포트 보기·상담 종료 버튼 */}
      <div className="hidden items-center gap-2 md:flex">
        <Link
          href={reportHref}
          className="flex items-center gap-1.5 rounded-full border border-line bg-card px-3.5 py-1.5 text-[0.8125rem] font-semibold text-ink transition hover:bg-paper-2"
        >
          리포트 보기
          <FileText className="text-[0.9375rem]" />
        </Link>
        {actions}
        {onClose && roomStatus === "ACTIVE" && (
          <button
            type="button"
            onClick={onClose}
            disabled={closePending}
            className="flex items-center gap-1.5 rounded-full bg-terra px-3.5 py-1.5 text-[0.8125rem] font-semibold text-white transition hover:brightness-[.96] disabled:cursor-not-allowed disabled:opacity-[.42]"
          >
            상담 종료
            <X className="text-[0.875rem]" />
          </button>
        )}
      </div>
    </header>
  );
}
