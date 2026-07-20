import Link from "next/link";
import { NEW_ANALYSIS_HREF } from "@/app/customer/_shared/model/report-routes";
import { buttonVariants } from "@/shared/ui/Button";

export function ReportListEmpty() {
  return (
    <div className="mt-6 flex flex-col items-center rounded-card border border-dashed border-line bg-paper-2 px-6 py-16 text-center">
      <p className="text-[0.875rem] text-ink-2">아직 분석한 리포트가 없어요</p>
      <Link
        href={NEW_ANALYSIS_HREF}
        className={buttonVariants({ variant: "gold", size: "sm", className: "mt-4" })}
      >
        새 분석 시작
      </Link>
    </div>
  );
}
