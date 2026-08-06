import Link from "next/link";
import { buttonVariants } from "@/shared/ui/Button";
import { ArrowRight } from "@/shared/ui/icons/ArrowRight";

interface PublicCtaBandProps {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
}

/**
 * navy 하단 CTA 밴드. 랜딩 CtaBandSection의 파라미터화 버전.
 */
export function PublicCtaBand({ title, subtitle, ctaLabel, ctaHref }: PublicCtaBandProps) {
  return (
    <section className="mx-auto w-full max-w-[80rem] px-6 py-12 md:px-14 md:py-16">
      <div className="overflow-hidden rounded-card-lg bg-navy px-6 py-12 text-center md:px-12 md:py-14">
        <h2 className="font-serif text-[1.75rem] font-bold text-white md:text-[2.5rem]">{title}</h2>
        <p className="mt-4 text-[0.9375rem] text-white/65 md:text-[1rem]">{subtitle}</p>
        <Link href={ctaHref} className={`${buttonVariants({ variant: "gold", size: "lg" })} mt-8`}>
          {ctaLabel}
          <ArrowRight className="size-[1.1875rem]" />
        </Link>
      </div>
    </section>
  );
}
