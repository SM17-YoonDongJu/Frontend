import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { ArrowRight } from "@/shared/ui/icons/ArrowRight";
import { FileText } from "@/shared/ui/icons/FileText";
import { buttonVariants } from "@/shared/ui/Button";

const NEW_ANALYSIS_HREF = "/customer/adjust-request";

const goldCtaClassName = cn(
  buttonVariants({ variant: "gold" }),
  "px-[1.4375rem] py-4 text-[0.94375rem]",
);

export function ReceivedProposalsEmpty() {
  return (
    <div className="flex flex-col items-center px-10 pt-13 pb-16 text-center md:pt-20 md:pb-28">
      <span className="flex size-[4.875rem] items-center justify-center rounded-full border border-line bg-paper-2">
        <FileText className="size-9 text-ink-2" />
      </span>

      <h2 className="mt-5 font-serif text-[1.4375rem] font-bold leading-[1.32] tracking-[-0.0144rem] text-ink">
        아직 받은 제안이 없어요
      </h2>

      <p className="mb-6 mt-2.5 max-w-[16rem] text-[0.83125rem] leading-[1.4rem] text-ink-3">
        분석을 요청하면 사정사들의 제안을 이곳에서 모아 볼 수 있어요.
      </p>

      <Link href={NEW_ANALYSIS_HREF} className={goldCtaClassName}>
        새 분석 시작
        <ArrowRight className="size-[1.1875rem]" />
      </Link>
    </div>
  );
}
