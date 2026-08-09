import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/ui/Button";
import { Home } from "@/shared/ui/icons/Home";
import { Search } from "@/shared/ui/icons/Search";
import { NotFoundBackButton } from "./_components/NotFoundBackButton";

/** 없는 경로·notFound() 시 표시되는 브랜드 404. 루트 layout 안에서 렌더(헤더/푸터 없음). */
export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 py-16 text-center">
      {/* 404 히어로: 4 [돋보기] 4 */}
      <div className="flex items-center justify-center gap-2 font-serif font-bold leading-none text-gold-ink">
        <span className="text-[5.75rem] md:text-[9.375rem]">4</span>
        <span className="flex size-[4.5rem] items-center justify-center rounded-full border-4 border-gold-2 md:size-[7.3125rem] md:border-[0.4375rem]">
          <Search className="text-[2.25rem] md:text-[3.6875rem]" />
        </span>
        <span className="text-[5.75rem] md:text-[9.375rem]">4</span>
      </div>

      <h1 className="mt-6 font-serif text-[1.5625rem] font-bold text-ink md:mt-8 md:text-[2.125rem]">
        페이지를 찾을 수 없어요
      </h1>

      {/* 본문 — 브레이크포인트별 문구 (Figma 그대로) */}
      <p className="mt-3 text-sm leading-relaxed text-ink-3 md:hidden">
        요청하신 페이지가 없거나 주소가 바뀌었어요. 입력한 주소를 다시 확인해 주세요.
      </p>
      <p className="mt-4 hidden max-w-[30rem] text-base leading-relaxed text-ink-3 md:block">
        요청하신 페이지가 없거나 주소가 바뀌었어요. 주소를 다시 확인하시거나 아래에서 이동해 주세요.
      </p>

      {/* 액션 — 모바일: 홈으로 + 이전 페이지로 / 데스크톱: 홈으로 + 손해사정사 찾기 */}
      <div className="mt-8 flex w-full max-w-[17.5rem] flex-col gap-3 md:w-auto md:max-w-none md:flex-row">
        <Link
          href="/"
          className={buttonVariants({ variant: "gold", size: "lg", full: true, className: "md:w-auto" })}
        >
          <Home className="text-[1.1875rem]" />
          홈으로
        </Link>
        <NotFoundBackButton className="md:hidden" />
        <Link
          href="/customer/adjusters"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "hidden md:inline-flex")}
        >
          <Search className="text-[1.1875rem]" />
          손해사정사 찾기
        </Link>
      </div>

      {/* 푸터 — 모바일: 고객센터 안내 / 데스크톱: 자주 찾는 페이지 퀵링크 */}
      <p className="mt-8 text-xs text-ink-3 md:hidden">
        계속 이 화면이 보이면 <span className="font-bold text-gold-ink">고객센터</span>로 알려주세요.
      </p>
      <nav className="mt-10 hidden items-center gap-3 text-[0.8125rem] md:flex">
        <span className="text-ink-3">자주 찾는 페이지</span>
        <span className="size-1 rounded-full bg-line" aria-hidden />
        <Link href="/customer/adjust-request" className="border-b border-gold-2 font-bold text-gold-ink">
          보상 분석 시작
        </Link>
        {/* TODO(#86): 리포트 리스트 라우트 확정 시 연결 (후속 #78) */}
        <Link href="#" className="border-b border-gold-2 font-bold text-gold-ink">
          내 분석 리포트
        </Link>
        {/* TODO(#86): 고객센터 라우트 확정 시 연결 */}
        <Link href="#" className="border-b border-gold-2 font-bold text-gold-ink">
          고객센터
        </Link>
      </nav>
    </main>
  );
}
