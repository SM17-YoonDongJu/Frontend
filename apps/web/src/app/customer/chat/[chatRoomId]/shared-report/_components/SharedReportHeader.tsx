import Link from "next/link";
import { accidentTypeLabel } from "@/shared/model/accident-type";
import { Check } from "@/shared/ui/icons/Check";
import { ChevronLeft } from "@/shared/ui/icons/ChevronLeft";
import { StatusBadge } from "@/shared/ui/StatusBadge";

const FALLBACK_TITLE = "검수 리포트";

function formatDate(iso: string): string {
  const [year, month, day] = iso.slice(0, 10).split("-");
  return year && month && day ? `${year}.${month}.${day}` : iso;
}

export interface SharedReportHeaderProps {
  title: string | null;
  caseNo: string;
  accidentType: string | null;
  submittedAt: string;
  backHref: string;
}

export function SharedReportHeader({
  title,
  caseNo,
  accidentType,
  submittedAt,
  backHref,
}: SharedReportHeaderProps) {
  const displayTitle = title ?? FALLBACK_TITLE;

  return (
    <>
      {/* 모바일: 얇은 back 바 */}
      <div className="sticky top-0 z-10 -mx-5 flex h-[3.6875rem] items-center gap-1 border-b border-line-2 bg-paper px-4 lg:hidden">
        <Link
          href={backHref}
          aria-label="상담방으로 돌아가기"
          className="flex size-[2.375rem] shrink-0 items-center justify-center rounded-full text-ink transition hover:bg-paper-2"
        >
          <ChevronLeft className="text-[1.375rem]" />
        </Link>
        <h1 className="truncate text-[0.9375rem] font-bold text-ink">{displayTitle}</h1>
      </div>

      <header className="mt-4 lg:mt-0">
        <div className="flex flex-wrap items-center gap-1.5 text-[0.78rem] text-ink-3">
          <span className="rounded-pill bg-paper-2 px-2.5 py-1">
            {accidentTypeLabel(accidentType)}
          </span>
          <span className="rounded-pill bg-paper-2 px-2.5 py-1">No.{caseNo}</span>
          <StatusBadge tone="green" icon={<Check className="text-[0.8125rem]" />}>
            검수 완료
          </StatusBadge>
          <span className="ml-auto whitespace-nowrap">{formatDate(submittedAt)} 제출</span>
        </div>
        <h1 className="mt-2 hidden font-serif text-[1.625rem] font-bold text-ink lg:block">
          {displayTitle}
        </h1>
      </header>
    </>
  );
}
