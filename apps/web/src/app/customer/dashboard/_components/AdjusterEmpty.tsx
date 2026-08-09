import Link from "next/link";
import { buttonVariants } from "@/shared/ui/Button";
import { Scale } from "@/shared/ui/icons/Scale";
import { DASHBOARD_LINKS } from "../_model/dashboard-links";

export function AdjusterEmpty() {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-input border border-dashed border-line-2 bg-paper-2 px-6 py-10 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-gold-soft text-[1.375rem] text-gold-ink">
        <Scale />
      </span>
      <p className="mt-3.5 text-[0.9375rem] font-semibold text-ink">
        아직 등록된 사정사님이 없어요
      </p>
      <p className="mt-1.5 text-[0.8125rem] leading-[1.6] text-ink-3">
        검수를 맡을 손해사정사가 등록되면
        <br />
        이곳에서 먼저 소개해 드릴게요.
      </p>
      <Link
        href={DASHBOARD_LINKS.adjusterFinder}
        className={buttonVariants({ variant: "outline", size: "sm", className: "mt-5 bg-card" })}
      >
        손해사정사 둘러보기
      </Link>
    </div>
  );
}
