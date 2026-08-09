"use client";

import { useRouter } from "next/navigation";

export function MobileAppBar() {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-20 flex items-center gap-1.5 bg-paper px-3 pb-3 pt-1 lg:hidden">
      <button
        type="button"
        aria-label="뒤로 가기"
        onClick={() => router.back()}
        className="flex size-[2.375rem] items-center justify-center rounded-button text-ink transition hover:bg-paper-2"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <p className="text-[0.9375rem] font-bold text-ink">손해사정사 프로필</p>
    </div>
  );
}
