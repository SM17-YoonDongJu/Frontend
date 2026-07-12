import type { InsuranceItem } from "../_model/types";
import { CheckCircle } from "@/shared/ui/icons/CheckCircle";
import { ShieldCheck } from "@/shared/ui/icons/ShieldCheck";

interface InsuranceCardProps {
  item: InsuranceItem;
}

/** 보험 카드 — 보험사/상품/특약 칩 + 증권 등록 상태(등록됨↔미등록 분기). */
export function InsuranceCard({ item }: InsuranceCardProps) {
  const registered = item.policyStatus === "REGISTERED";

  return (
    <article className="flex flex-col rounded-[0.875rem] border border-line p-[1.1875rem]">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-button bg-gold-soft text-gold-ink">
          <ShieldCheck className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="text-[0.75rem] text-ink-3">{item.insurerName}</p>
          <p className="mt-0.5 truncate text-[0.875rem] font-bold text-ink">
            {item.productName}
          </p>
        </div>
      </div>

      {item.riders.length > 0 && (
        <ul className="mt-3.5 flex flex-wrap gap-1.5">
          {item.riders.map((rider) => (
            <li
              key={rider}
              className="rounded-pill border border-line-2 bg-paper-2 px-2.5 py-1 text-[0.6875rem] font-bold text-ink-2"
            >
              {rider}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3.5 flex items-center justify-between border-t border-line-2 pt-3">
        {registered ? (
          <span className="inline-flex items-center gap-1.5 text-[0.75rem] font-bold text-green">
            <CheckCircle className="size-3.5" />
            증권 등록됨
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[0.75rem] font-bold text-gold-ink">
            <ShieldCheck className="size-3.5" />
            증권 미등록
          </span>
        )}
        <button
          type="button"
          className="text-[0.8125rem] font-bold text-ink-2 transition hover:text-ink"
        >
          {registered ? "상세 보기" : "증권 올리기"}
        </button>
      </div>
    </article>
  );
}
