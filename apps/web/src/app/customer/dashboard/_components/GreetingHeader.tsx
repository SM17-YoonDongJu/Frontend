"use client";

import Link from "next/link";
import { useMe } from "@/shared/api/use-me";
import { Plus } from "@/shared/ui/icons/Plus";
import { DASHBOARD_LINKS } from "../_model/dashboard-links";

export function GreetingHeader() {
  const { data: me } = useMe();

  return (
    <header className="flex flex-col md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="font-serif text-[1.375rem] font-bold leading-[1.85rem] tracking-[-0.01rem] text-ink md:text-[1.75rem] md:leading-[2.275rem]">
          안녕하세요, {me.nickname}님
        </h1>
        <p className="mt-1 text-[0.8125rem] tracking-[-0.01rem] text-ink-3 md:mt-2 md:text-sm">
          진행 중인 보상 절차와 오늘 확인할 일을 모았어요.
        </p>
      </div>

      <Link
        href={DASHBOARD_LINKS.newAnalysis}
        className="hidden items-center gap-2 rounded-button bg-ink px-[1.375rem] py-[0.8125rem] text-sm font-semibold text-white transition hover:brightness-[.96] md:inline-flex"
      >
        <Plus className="text-[0.9375rem]" />
        새 분석 시작
      </Link>
    </header>
  );
}
