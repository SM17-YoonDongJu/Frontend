"use client";

import { useEffect } from "react";
import Link from "next/link";
import { fontVariables } from "@/shared/fonts";
import { cn } from "@/shared/lib/utils";
import { Button, buttonVariants } from "@/shared/ui/Button";
import { AlertTriangle } from "@/shared/ui/icons/AlertTriangle";
import { Home } from "@/shared/ui/icons/Home";
import { RefreshCw } from "@/shared/ui/icons/RefreshCw";
import { Scale } from "@/shared/ui/icons/Scale";
import "./globals.css";

/**
 * 루트 layout이 던진 예기치 못한 오류의 최상위 폴백.
 * layout을 대체하므로 자체 <html>/<body>를 포함하고 globals.css·폰트를 직접 연결한다.
 * Providers(React Query·MSW) 밖에서 렌더 → 데이터 훅 없이 순수 정적 화면.
 */
export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 운영에선 message가 가려지고 digest만 옴 — 서버 로그 대조용으로 기록.
    console.error(error);
  }, [error]);

  return (
    <html lang="ko" className={fontVariables}>
      <body className="min-h-dvh bg-paper font-sans text-ink antialiased">
        <div className="flex min-h-dvh flex-col">
          {/* 브랜드 헤더 */}
          <header className="flex items-center gap-2.5 px-6 py-5 md:px-10">
            <span className="flex size-[1.625rem] items-center justify-center rounded-chip bg-gold text-white md:size-[1.875rem]">
              <Scale className="text-[1rem] md:text-[1.1875rem]" />
            </span>
            <span className="font-serif text-[1.0625rem] font-bold text-ink md:text-xl">바른보상</span>
          </header>

          {/* 중앙 콘텐츠 */}
          <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            {/* 경고 뱃지 */}
            <div className="flex size-[7.25rem] items-center justify-center rounded-full border border-terra-2 md:size-[8.25rem]">
              <div className="flex size-[5.75rem] items-center justify-center rounded-full bg-terra-soft md:size-[6.5rem]">
                <AlertTriangle className="text-[2.375rem] text-terra md:text-[2.875rem]" />
              </div>
            </div>

            <h1 className="mt-8 font-serif text-[1.5625rem] font-bold text-ink md:text-[2.125rem]">
              문제가 발생했어요
            </h1>

            {/* 본문 — 브레이크포인트별 문구 (Figma 그대로) */}
            <p className="mt-3 text-sm leading-relaxed text-ink-3 md:hidden">
              일시적인 오류로 화면을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
            </p>
            <p className="mt-4 hidden max-w-[32rem] text-base leading-relaxed text-ink-3 md:block">
              예기치 못한 오류로 페이지를 표시하지 못했어요. 잠시 후 다시 시도해 주세요.
              <br />
              문제가 계속되면 고객센터로 알려주세요.
            </p>

            {/* 액션 — 모바일: 다시 시도(full) + 홈으로(ghost) / 데스크톱: 나란히 */}
            <div className="mt-8 flex w-full max-w-[17.5rem] flex-col gap-3 md:w-auto md:max-w-none md:flex-row">
              <Button
                variant="gold"
                size="lg"
                full
                className="md:w-auto"
                iconLeft={<RefreshCw className="text-[1.1875rem]" />}
                onClick={reset}
              >
                다시 시도
              </Button>
              <Link
                href="/"
                className={cn(buttonVariants({ variant: "ghost", size: "lg", full: true }), "md:hidden")}
              >
                <Home className="text-[1.1875rem]" />
                홈으로
              </Link>
              <Link
                href="/"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "hidden md:inline-flex")}
              >
                <Home className="text-[1.1875rem]" />
                홈으로
              </Link>
            </div>

            {/* 오류 코드 pill — digest 있을 때만 (대조용) */}
            {error.digest && (
              <div className="mt-6 inline-flex items-center gap-2 rounded-chip border border-line-2 bg-paper-2 px-3 py-1.5 md:border-line md:bg-card">
                <span className="text-[0.6875rem] text-ink-3 md:text-xs">오류 코드</span>
                <span className="text-[0.6875rem] font-bold text-ink-2 md:text-xs">{error.digest}</span>
              </div>
            )}
          </main>

          {/* 푸터 — 브레이크포인트별 (Figma 그대로) */}
          <footer className="px-6 py-6 text-center text-xs text-ink-3">
            <span className="md:hidden">문제가 반복되면 오류 코드와 함께 고객센터로 문의해 주세요.</span>
            <span className="hidden md:inline">© 바른보상 · 분석은 참고용 추정이며 법적 효력이 없습니다.</span>
          </footer>
        </div>
      </body>
    </html>
  );
}
