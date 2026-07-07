import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { ArrowRight } from "@/shared/ui/icons/ArrowRight";
import { FileText } from "@/shared/ui/icons/FileText";
import { buttonVariants } from "@/shared/ui/Button";

export type CustomerReportsEmptyVariant = "no-data" | "no-filter-result";

/** 새 분석 신청 진입. */
const NEW_ANALYSIS_HREF = "/customer/adjust-request";

const EMPTY_COPY: Record<CustomerReportsEmptyVariant, { title: string; desc: string }> = {
  "no-data": {
    title: "아직 분석 리포트가 없어요",
    desc: "받은 보험금이 적정한지 궁금하다면\n첫 보상 분석을 시작해보세요.",
  },
  "no-filter-result": {
    title: "이 조건의 내역이 없어요",
    desc: "다른 필터를 선택하거나 전체 내역을 확인해 보세요.",
  },
};

const goldCtaClassName = cn(
  buttonVariants({ variant: "gold" }),
  "px-[1.4375rem] py-4 text-[0.94375rem]",
);

interface Props {
  variant: CustomerReportsEmptyVariant;
  onResetFilter?: () => void;
}

export function CustomerReportsEmpty({ variant, onResetFilter }: Props) {
  const copy = EMPTY_COPY[variant];

  const cta =
    variant === "no-filter-result" ? (
      <button type="button" onClick={onResetFilter} className={goldCtaClassName}>
        전체 보기
      </button>
    ) : (
      <Link href={NEW_ANALYSIS_HREF} className={goldCtaClassName}>
        새 분석 시작
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

      <p className="mb-6 mt-2.5 max-w-[16rem] whitespace-pre-line text-[0.83125rem] leading-[1.4rem] text-ink-3">
        {copy.desc}
      </p>

      {cta}
    </div>
  );
}
