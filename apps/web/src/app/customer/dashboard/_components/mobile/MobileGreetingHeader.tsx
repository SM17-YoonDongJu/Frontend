"use client";

import { useMe } from "@/shared/api/use-me";
import { Bell } from "@/shared/ui/icons/Bell";

export function MobileGreetingHeader() {
  const { data: me } = useMe();

  return (
    <header className="flex items-start justify-between pt-2">
      <div>
        <p className="text-[0.8125rem] font-medium text-ink-3">안녕하세요</p>
        <p className="mt-1 text-[1.375rem] font-bold text-ink">{me.nickname} 님</p>
      </div>

      <span
        aria-disabled
        aria-label="알림 (준비 중)"
        className="relative flex size-[2.625rem] items-center justify-center rounded-input border border-line bg-card text-ink-2"
      >
        <Bell className="text-[1.25rem]" />
        <span className="absolute right-2.5 top-2.5 size-[0.4375rem] rounded-full border border-white bg-terra" />
      </span>
    </header>
  );
}
