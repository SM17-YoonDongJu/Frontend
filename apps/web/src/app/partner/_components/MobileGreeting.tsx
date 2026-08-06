"use client";

import { useProfile } from "../_shared/api/use-profile";
import { NotificationBell } from "./NotificationBell";

export function MobileGreeting() {
  const { data } = useProfile();

  return (
    <div className="flex items-center justify-between">
      <div className="min-w-0">
        <p className="text-[0.8125rem] text-ink-3">안녕하세요</p>
        <p className="truncate text-[1.25rem] font-bold tracking-[-0.01rem] text-ink">
          {data ? `${data.nickname} 사정사님` : "사정사님"}
        </p>
      </div>
      <NotificationBell />
    </div>
  );
}
