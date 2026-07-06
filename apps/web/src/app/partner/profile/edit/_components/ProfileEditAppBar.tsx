"use client";

import { ChevronLeft } from "@/shared/ui/icons/ChevronLeft";

export function ProfileEditAppBar() {
  return (
    <div className="sticky top-0 z-10 flex h-[3.375rem] items-center bg-paper px-3 lg:hidden">
      <button
        type="button"
        aria-label="뒤로 가기"
        onClick={() => window.history.back()}
        className="flex size-[2.375rem] items-center justify-center rounded-button text-ink transition hover:bg-paper-2"
      >
        <ChevronLeft className="text-[1.375rem]" />
      </button>
      <span className="ml-1 text-[1rem] font-bold text-ink">프로필 관리</span>
    </div>
  );
}
