"use client";

import { Bell } from "@/shared/ui/icons/Bell";
import { useProfile } from "../_shared/api/use-profile";

export function NotificationBell() {
  const { data } = useProfile();
  const hasUnread = (data?.pendingReviewCount ?? 0) > 0;

  return (
    <button
      type="button"
      aria-label="알림"
      className="relative flex size-[2.625rem] items-center justify-center rounded-full border border-line bg-card text-ink transition hover:bg-paper"
    >
      <Bell className="text-[1.25rem]" />
      {hasUnread && (
        <span className="absolute right-2.5 top-2 size-[0.4375rem] rounded-full border border-white bg-terra" />
      )}
    </button>
  );
}
