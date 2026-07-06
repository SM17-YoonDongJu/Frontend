import Link from "next/link";
import type { AdjusterListItem } from "../_model/types";
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/ui/Button";
import { StarRating } from "@/shared/ui/StarRating";
import { ArrowRight } from "@/shared/ui/icons/ArrowRight";
import { CheckCircle } from "@/shared/ui/icons/CheckCircle";
import { ShieldCheck } from "@/shared/ui/icons/ShieldCheck";

const numberFormatter = new Intl.NumberFormat("ko-KR");

export function AdjusterCard({ adjuster }: { adjuster: AdjusterListItem }) {
  const {
    adjusterId,
    name,
    avatarUrl,
    verified,
    specialties,
    headline,
    averageRating,
    reviewCount,
    career,
    completedConsultCount,
    activityRegion,
  } = adjuster;

  const primarySpecialty = specialties[0];

  return (
    <article className="flex flex-col rounded-card border border-line bg-card p-5 md:p-6">
      <div className="flex gap-4">
        <span
          aria-hidden
          className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-navy font-serif text-xl font-semibold text-white"
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="" className="size-full object-cover" />
          ) : (
            name.trim().charAt(0) || "?"
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate font-semibold text-ink">{name}</h3>
            {verified && (
              <CheckCircle className="shrink-0 text-[0.9375rem] text-gold-ink" />
            )}
          </div>

          <p className="mt-1 truncate text-[0.8125rem] text-ink-3">
            경력 {career}년
            {primarySpecialty && <span className="md:hidden"> · {primarySpecialty} 전문</span>}
            <span className="hidden md:inline"> · {activityRegion}</span>
          </p>

          <div className="mt-1.5 flex items-center gap-1.5 text-[0.8125rem]">
            <StarRating score={averageRating} max={1} size={0.875} />
            <span className="font-semibold text-ink">{averageRating.toFixed(1)}</span>
            <span className="text-ink-3 md:hidden">· 상담 {completedConsultCount}+</span>
            <span className="hidden text-ink-3 md:inline">(후기 {numberFormatter.format(reviewCount)})</span>
          </div>
        </div>
      </div>

      {headline && <p className="mt-4 hidden text-sm text-ink-2 md:block">{headline}</p>}

      {specialties.length > 0 && (
        <ul className="mt-3 hidden flex-wrap gap-2 md:flex">
          {specialties.map((tag) => (
            <li
              key={tag}
              className="rounded-tag bg-gold-soft px-2.5 py-1 text-xs font-medium text-gold-ink"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}

      <dl className="mt-4 hidden grid-cols-2 gap-3 md:grid">
        <StatBox value={`${numberFormatter.format(completedConsultCount)}+`} label="누적 상담" />
        <StatBox value={`${career}년`} label="경력" />
      </dl>

      <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
        <span className="flex items-center gap-1.5 text-[0.8125rem] text-ink-2">
          <ShieldCheck className="text-base text-green" />
          자격·신원 인증
        </span>

        <div className="flex items-center gap-2">
          <Link
            href={`/customer/adjusters/${adjusterId}`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "hidden md:inline-flex")}
          >
            프로필
          </Link>
          <Link
            href={`/customer/chat?adjusterId=${adjusterId}`}
            className={buttonVariants({ variant: "primary", size: "sm" })}
          >
            상담 신청
            <ArrowRight />
          </Link>
        </div>
      </div>
    </article>
  );
}

function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-input border border-line bg-paper-2 py-3 text-center">
      <dt className="sr-only">{label}</dt>
      <dd className="font-serif text-xl font-semibold text-ink">{value}</dd>
      <p className="mt-0.5 text-xs text-ink-3">{label}</p>
    </div>
  );
}
