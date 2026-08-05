"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
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
  onSelect
}: {
  action: ChatThreadHeaderMenuAction;
  onSelect: () => void;
}) {
  const danger = action.tone === "danger";
  const className = cn(
    "flex w-full items-center gap-3 px-3.5 py-3 text-left text-[0.8125rem] font-semibold transition",
    danger ? "text-terra hover:bg-terra-soft/60" : "text-ink hover:bg-paper-2",
    action.disabled && "pointer-events-none cursor-not-allowed opacity-[.42]"
  );
  const content = (
    <>
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full text-[0.9375rem]",
          danger ? "bg-terra-soft text-terra" : "bg-paper-2 text-ink-2"
        )}
      >
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
  menuActions
}: ChatThreadHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const subtitle =
    subtitleOverride ?? [caseNo, ROOM_STATUS_META[roomStatus].label].filter(Boolean).join(" · ");

  // 바깥 클릭·Esc로 닫기(진짜 오버레이 팝업이라 문서 흐름과 분리돼 있음).
  useEffect(() => {
    if (!menuOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <header className="relative flex items-center gap-2.5 border-b border-line-2 bg-paper px-4 py-3 md:bg-card md:px-5">
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

      {menuActions.length > 0 && (
        <div ref={menuRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls={MENU_ID}
            className="flex items-center gap-1.5 rounded-full border border-line bg-card px-3.5 py-1.5 text-[0.8125rem] font-semibold text-ink-2 transition hover:bg-paper-2"
          >
            더보기
            <ChevronDown
              className={cn("text-[0.9375rem] transition-transform", menuOpen && "rotate-180")}
            />
          </button>

          {menuOpen && (
            <div
              id={MENU_ID}
              role="menu"
              className="absolute top-[calc(100%+0.5rem)] right-0 z-20 w-56 overflow-hidden rounded-card bg-card shadow-popover divide-y divide-line-2"
            >
              {menuActions.map((action) => (
                <MenuActionItem
                  key={action.key}
                  action={action}
                  onSelect={() => setMenuOpen(false)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
