"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Bell } from "@/shared/ui/icons/Bell";
import { Popover } from "@/shared/ui/Popover";
import { useNotificationUnreadCount } from "@/shared/api/use-notification-unread-count";
import { NotificationPopover } from "./NotificationPopover";

const BELL_CLASS =
  "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl text-ink-2 transition hover:bg-paper hover:text-ink";

interface NotificationBellMenuProps {
  /** 팝오버 하단 "알림 설정" 이동 경로 — 역할별 마이페이지가 달라 소비처가 지정한다. */
  settingsHref: string;
}

export function NotificationBellMenu({ settingsHref }: NotificationBellMenuProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const unreadCount = useNotificationUnreadCount();
  const hasUnread = unreadCount != null && unreadCount > 0;

  const unreadDot = hasUnread && (
    <span
      className="absolute right-2 top-2 size-1.5 rounded-full bg-terra"
      aria-label="읽지 않은 알림 있음"
    />
  );

  return (
    <>
      <Link
        href="/notifications"
        aria-label="알림"
        className={`md:hidden ${BELL_CLASS}`}
      >
        <Bell />
        {unreadDot}
      </Link>

      <div className="relative hidden md:block">
        <button
          ref={triggerRef}
          type="button"
          aria-label="알림"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className={BELL_CLASS}
        >
          <Bell />
          {unreadDot}
        </button>
        <Popover
          open={open}
          onClose={() => setOpen(false)}
          triggerRef={triggerRef}
          label="알림"
          className="w-95 bg-paper"
        >
          <NotificationPopover
            settingsHref={settingsHref}
            onClose={() => setOpen(false)}
          />
        </Popover>
      </div>
    </>
  );
}
