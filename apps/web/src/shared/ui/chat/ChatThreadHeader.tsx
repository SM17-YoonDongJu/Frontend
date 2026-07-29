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
  /** 사건번호 — 사정사 검색 방(리포트 없음)은 null */
  caseNo: string | null;
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
  /** 모바일 우측 액션 슬롯. 전달 시 모바일 리포트 아이콘 대신 표시(customer 매칭 버튼). 미전달(partner)=현행 리포트 아이콘 */
  mobileActions?: ReactNode;
  /** 상담 종료(데스크톱 전용 버튼, partner 하위호환). ACTIVE 방에서만 노출 */
  onClose?: () => void;
  closePending?: boolean;
  /** 상대 프로필 링크(customer→사정사 프로필). 없으면(partner) 링크 없이 렌더 */
  profileHref?: string;
}

/** href가 있으면 아바타·이름 묶음을 프로필 링크로, 없으면(partner) 헤더 flex에 그대로 편다. */
function ProfileLink({ href, children }: { href?: string; children: ReactNode }) {
  if (!href) return <>{children}</>;

  return (
    <Link
      href={href}
      className="flex min-w-0 flex-1 items-center gap-2.5 transition hover:opacity-80"
    >
      {children}
    </Link>
  );
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
  mobileActions,
  onClose,
  closePending,
  profileHref,
}: ChatThreadHeaderProps) {
  const subtitle =
    subtitleOverride ??
    [caseNo, ROOM_STATUS_META[roomStatus].label].filter(Boolean).join(" · ");

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

      <ProfileLink href={profileHref}>
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
      </ProfileLink>

      {/* 모바일 — 매칭 액션 주입 시(customer) 리포트 아이콘 대신 표시, 아니면(partner) 리포트 아이콘. Figma 1012:9931 */}
      {mobileActions ? (
        <div className="flex shrink-0 items-center gap-1.5 md:hidden">{mobileActions}</div>
      ) : (
        <Link
          href={reportHref}
          aria-label="리포트 보기"
          className="flex size-9 items-center justify-center rounded-button text-[1.1875rem] text-ink transition hover:bg-paper-2 md:hidden"
        >
          <FileText />
        </Link>
      )}

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
