"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import type { RoomStatus } from "@/shared/api/chat/chat.schema";
import { cn } from "@/shared/lib/utils";
import { Avatar } from "@/shared/ui/Avatar";
import { ChevronDown } from "@/shared/ui/icons/ChevronDown";
import { ChevronRight } from "@/shared/ui/icons/ChevronRight";
import { ShieldCheck } from "@/shared/ui/icons/ShieldCheck";
import { ROOM_STATUS_META } from "./room-status";

const MENU_ID = "chat-header-menu";

export interface ChatThreadHeaderMenuAction {
  key: string;
  label: string;
  icon: ReactNode;
  /** 있으면 링크, 없으면 버튼 */
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  /** danger = 매칭 거절·상담 종료 */
  tone?: "default" | "danger";
}

export interface ChatThreadHeaderProps {
  name: string;
  /** 사건번호 — 사정사 검색 방(리포트 없음)은 null */
  caseNo: string | null;
  roomStatus: RoomStatus;
  /** 모바일 뒤로가기 — 없으면 버튼 미노출 */
  onBack?: () => void;
  /** 이름 옆 배지(매칭 완료 등). 없으면 미표시 */
  badge?: ReactNode;
  /** 서브타이틀 오버라이드. 없으면 기존 caseNo·roomStatus 라벨 */
  subtitle?: string;
  /** 상대 프로필 링크(customer→사정사 프로필). 없으면(partner) 링크 없이 렌더 */
  profileHref?: string;
  /** 헤더 보조 액션 — 데스크톱·모바일 공통으로 "더보기" 패널에 세로 나열 */
  menuActions: ChatThreadHeaderMenuAction[];
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

function MenuActionItem({
  action,
  onSelect,
}: {
  action: ChatThreadHeaderMenuAction;
  onSelect: () => void;
}) {
  const className = cn(
    "flex w-full items-center gap-2.5 rounded-button px-3 py-2.5 text-left text-[0.8125rem] font-semibold transition hover:bg-paper-2",
    action.tone === "danger" ? "text-terra" : "text-ink",
    action.disabled && "pointer-events-none cursor-not-allowed opacity-[.42]",
  );
  const content = (
    <>
      <span className="flex w-5 shrink-0 justify-center text-[0.9375rem]">
        {action.icon}
      </span>
      {action.label}
    </>
  );

  if (action.href) {
    return (
      <Link
        href={action.href}
        role="menuitem"
        aria-disabled={action.disabled}
        className={className}
        onClick={onSelect}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      role="menuitem"
      disabled={action.disabled}
      className={className}
      onClick={() => {
        onSelect();
        action.onClick?.();
      }}
    >
      {content}
    </button>
  );
}

export function ChatThreadHeader({
  name,
  caseNo,
  roomStatus,
  onBack,
  badge,
  subtitle: subtitleOverride,
  profileHref,
  menuActions,
}: ChatThreadHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const subtitle =
    subtitleOverride ??
    [caseNo, ROOM_STATUS_META[roomStatus].label].filter(Boolean).join(" · ");

  return (
    <>
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
            <p className="hidden truncate text-[0.6875rem] text-ink-3 md:block">
              {subtitle}
            </p>
            <span className="sr-only md:hidden">{subtitle}</span>
          </div>
        </ProfileLink>

        {menuActions.length > 0 && (
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls={MENU_ID}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-card px-3.5 py-1.5 text-[0.8125rem] font-semibold text-ink-2 transition hover:bg-paper-2"
          >
            더보기
            <ChevronDown
              className={cn(
                "text-[0.9375rem] transition-transform",
                menuOpen && "rotate-180",
              )}
            />
          </button>
        )}
      </header>

      {/* 오버레이가 아니라 문서 흐름에 끼워 넣어 대화를 아래로 민다(grid-rows 0fr↔1fr 확장) */}
      <div
        inert={!menuOpen}
        className={cn(
          "grid shrink-0",
          menuOpen
            ? "grid-rows-[1fr] transition-[grid-template-rows] duration-200"
            : // 접힐 땐 높이 애니메이션이 끝난 뒤 visibility를 끈다(클릭·포커스 차단)
              "invisible grid-rows-[0fr] [transition:grid-template-rows_200ms_ease,visibility_0s_200ms]",
        )}
      >
        <div className="overflow-hidden">
          <div
            id={MENU_ID}
            role="menu"
            className="flex flex-col border-b border-line-2 bg-card p-2 md:px-3"
          >
            {menuActions.map((action) => (
              <MenuActionItem
                key={action.key}
                action={action}
                onSelect={() => setMenuOpen(false)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
