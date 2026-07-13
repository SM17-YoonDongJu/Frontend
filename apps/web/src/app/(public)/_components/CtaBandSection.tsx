import Link from "next/link";
import { buttonVariants } from "@/shared/ui/Button";
import { ArrowRight } from "@/shared/ui/icons/ArrowRight";

/**
 * PC 하단 CTA 밴드(navy).
 */
export function CtaBandSection() {
  return (
    <section className="mx-auto w-full max-w-[80rem] px-14 py-10">
      <div className="overflow-hidden rounded-[1.5rem] bg-navy px-12 py-14 text-center">
        <h2 className="font-serif text-[2.5rem] font-bold text-white">
          지금, 내 보상부터 확인하세요
        </h2>
        <p className="mt-4 text-[1rem] text-white/65">
          참고용 분석은 무료입니다. 5분이면 충분해요.
        </p>
        <Link
          href="/login"
          className={`${buttonVariants({ variant: "gold", size: "lg" })} mt-8`}
        >
          내 보상 분석하기
          <ArrowRight className="size-[1.1875rem]" />
        </Link>
      </div>
    </section>
  );
}
