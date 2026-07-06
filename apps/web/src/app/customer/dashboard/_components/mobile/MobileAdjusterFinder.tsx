import Link from "next/link";
import { buttonVariants } from "@/shared/ui/Button";
import { ChevronRight } from "@/shared/ui/icons/ChevronRight";
import { Scale } from "@/shared/ui/icons/Scale";
import { Search } from "@/shared/ui/icons/Search";
import { DASHBOARD_LINKS } from "@/app/customer/dashboard/_model/dashboard-links";

export function MobileAdjusterFinder() {
  return (
    <section>
      <h2 className="text-base font-bold text-ink">손해사정사 검색</h2>

      <div className="mt-3.5 flex flex-col gap-3">
        <Link
          href={DASHBOARD_LINKS.adjusterFinder}
          className="flex items-center gap-3.5 rounded-card border border-line bg-card p-4 shadow-[0px_1px_1px_rgba(21,32,46,0.03)] transition hover:brightness-[.98]"
        >
          <span className="flex size-[2.375rem] shrink-0 items-center justify-center rounded-button bg-navy text-white">
            <Search className="text-[1.1875rem]" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold text-ink">지역 · 전문분야로 검색</span>
            <span className="mt-1 block text-[0.75rem] text-ink-3">
              후유장해 · 교통사고 · 실손 전문가 128명
            </span>
          </span>
          <ChevronRight className="shrink-0 text-[1.0625rem] text-ink-3" />
        </Link>

        <div className="flex items-center gap-3.5 rounded-card border border-line bg-paper-2 p-4 shadow-[0px_1px_1px_rgba(21,32,46,0.03)]">
          <span className="flex size-[2.375rem] shrink-0 items-center justify-center rounded-button bg-navy text-white">
            <Scale className="text-[1.1875rem]" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-ink">전문가 검토를 권장해요</p>
            <p className="mt-1 text-[0.75rem] text-ink-3">후유장해 전문 손해사정사 연결</p>
          </div>
          <Link
            href={DASHBOARD_LINKS.adjusterFinder}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            연결
          </Link>
        </div>
      </div>
    </section>
  );
}
