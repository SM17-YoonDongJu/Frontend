"use client";

import Link from "next/link";
import { clearReturnPath } from "@/shared/lib/return-path";

/** 홈으로 이탈 = 안내 흐름 종료. 남은 복귀 경로를 지워 이후 일반 로그인이 보호 페이지로 튀지 않게 한다. */
export function HomeLink() {
  return (
    <Link
      href="/"
      onClick={clearReturnPath}
      className="text-[0.8125rem] font-medium text-ink-3 transition hover:text-ink-2"
    >
      홈으로 돌아가기
    </Link>
  );
}
