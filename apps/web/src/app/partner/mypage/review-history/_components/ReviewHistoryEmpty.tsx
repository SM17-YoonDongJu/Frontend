import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { ArrowRight } from "@/shared/ui/icons/ArrowRight";
import { FileText } from "@/shared/ui/icons/FileText";
import { buttonVariants } from "@/shared/ui/Button";

export type ReviewHistoryEmptyVariant = "no-data" | "no-filter-result";

/** 검수 대기 목록 라우트(검수 시작 진입). */
const REVIEW_PENDING_HREF = "/partner/review";

const EMPTY_COPY: Record<ReviewHistoryEmptyVariant, { title: string; desc: string }> = {
  "no-data": {
    title: "아직 검수한 내역이 없어요",
    desc: "검수를 완료하면 이곳에서 지난 내역을 확인할 수 있어요.",
  },
  "no-filter-result": {
    title: "이 조건의 검수 내역이 없어요",
    desc: "다른 필터를 선택하거나 전체 내역을 확인해 보세요.",
  },
};

const goldCtaClassName = cn(
  buttonVariants({ variant: "gold" }),
  "px-[1.4375rem] py-4 text-[0.94375rem]",
);

interface Props {
  variant: ReviewHistoryEmptyVariant;
  onResetFilter?: () => void;
}

export function ReviewHistoryEmpty({ variant, onResetFilter }: Props) {
  const copy = EMPTY_COPY[variant];

  const cta =
    variant === "no-filter-result" ? (
      <button type="button" onClick={onResetFilter} className={goldCtaClassName}>
        전체 내역 보기
      </button>
    ) : (
      <Link href={REVIEW_PENDING_HREF} className={goldCtaClassName}>
        검수 대기 보러가기
        <ArrowRight className="size-[1.1875rem]" />
      </Link>
    );

  return (
    <div className="flex flex-col items-center px-10 pt-13 pb-16 text-center">
      <span className="flex size-[4.875rem] items-center justify-center rounded-full border border-line bg-paper-2">
        <FileText className="size-9 text-ink-2" />
      </span>

      <h2 className="mt-5 font-serif text-[1.4375rem] font-bold leading-[1.32] tracking-[-0.0144rem] text-ink">
        {copy.title}
      </h2>

      <p className="mb-6 mt-2.5 max-w-[16rem] text-[0.83125rem] leading-[1.4rem] text-ink-3">
        {copy.desc}
      </p>

      {cta}
    </div>
  );
}
