import Link from "next/link";
import { NEW_ANALYSIS_HREF } from "@/app/customer/_shared/model/report-routes";
import { buttonVariants } from "@/shared/ui/Button";
import { FileText } from "@/shared/ui/icons/FileText";
import { Plus } from "@/shared/ui/icons/Plus";

export function ReportListEmpty() {
  return (
    <div className="mt-6 flex flex-col items-center rounded-card-lg border border-line bg-paper-2 px-6 py-14 text-center">
      <div className="relative">
        <span className="flex size-14 items-center justify-center rounded-card border border-line bg-card text-ink shadow-raised">
          <FileText className="text-[1.5rem]" />
        </span>
        <span className="absolute -bottom-1.5 -right-1.5 flex size-[1.375rem] items-center justify-center rounded-full border border-white bg-gold-soft text-gold-ink">
          <Plus className="text-[0.75rem]" />
        </span>
      </div>

      <p className="mt-5 font-serif text-[1.1875rem] font-bold text-ink">
        아직 분석한 리포트가 없어요
      </p>
      <p className="mt-2 max-w-[19rem] text-[0.8125rem] leading-[1.5] text-ink-3">
        새 분석을 시작하면 예상 보상 범위와 쟁점을 정리한 리포트를 여기서 확인할 수 있어요.
      </p>

      <Link
        href={NEW_ANALYSIS_HREF}
        className={buttonVariants({ variant: "gold", size: "md", className: "mt-6" })}
      >
        새 분석 시작
      </Link>
    </div>
  );
}
