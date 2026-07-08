import Link from "next/link";
import { ChevronLeft } from "@/shared/ui/icons/ChevronLeft";
import { ChevronRight } from "@/shared/ui/icons/ChevronRight";

export function ReviewHeader({ reportId }: { reportId: string }) {
  const detailHref = `/customer/report/${reportId}`;

  return (
    <>
      <header className="flex h-14 items-center justify-between bg-paper px-4 lg:hidden">
        <Link
          href={detailHref}
          aria-label="뒤로"
          className="-ml-1 flex size-9 items-center justify-center rounded-full text-ink transition hover:bg-paper-2"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <span className="text-[0.9375rem] font-bold text-ink">리뷰 작성</span>
        <Link href={detailHref} className="text-[0.875rem] font-medium text-ink-3 transition hover:text-ink">
          나중에
        </Link>
      </header>

      <nav aria-label="위치" className="hidden items-center gap-1 text-[0.8125rem] lg:flex">
        <Link href="/customer/dashboard" className="text-ink-3 transition hover:text-ink">
          내 분석 리포트
        </Link>
        <ChevronRight className="size-3.5 text-ink-3" />
        <Link href={detailHref} className="text-ink-3 transition hover:text-ink">
          사건 종결
        </Link>
        <ChevronRight className="size-3.5 text-ink-3" />
        <span className="font-bold text-ink">리뷰 작성</span>
      </nav>
    </>
  );
}
