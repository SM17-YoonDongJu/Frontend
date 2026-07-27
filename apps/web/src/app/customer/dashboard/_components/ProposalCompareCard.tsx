"use client";

import Link from "next/link";
import { Avatar } from "@/shared/ui/Avatar";
import { useDashboard } from "../_api/use-dashboard";
import { DASHBOARD_LINKS } from "../_model/dashboard-links";
import { OfferRangeBar, toManwon } from "./OfferRangeBar";

export function ProposalCompareCard() {
  const { data } = useDashboard();
  const summary = data.proposalSummary;

  if (!summary || summary.count === 0) return null;

  return (
    <section className="rounded-card border border-line bg-card p-[1.5625rem]">
      <header className="flex items-center justify-between">
        <h2 className="text-base font-bold text-ink">받은 제안 비교</h2>
        <Link
          href={DASHBOARD_LINKS.proposalsList}
          className="text-[0.8125rem] font-medium text-ink-3 transition hover:text-ink-2"
        >
          <span className="md:hidden">전체</span>
          <span className="hidden md:inline">전체 보기</span> ›
        </Link>
      </header>

      {/* 견적 미기입 제안만 있으면 집계 금액이 null — 금액 블록을 접고 건수만 표시 */}
      {summary.minAmount != null && summary.maxAmount != null ? (
        <>
          <div className="mt-[1.125rem] flex items-end justify-between">
            <div>
              <p className="text-[0.75rem] font-medium text-ink-3">최저 제안가</p>
              <p className="mt-1 font-serif text-[1.375rem] font-bold text-ink">
                {toManwon(summary.minAmount)}만원
              </p>
            </div>
            <div className="text-right">
              <p className="text-[0.75rem] font-medium text-ink-3">최고 제안가</p>
              <p className="mt-1 font-serif text-[1.375rem] font-bold text-gold-ink">
                {toManwon(summary.maxAmount)}만원
              </p>
            </div>
          </div>

          <div className="mt-3">
            <OfferRangeBar
              min={summary.minAmount}
              max={summary.maxAmount}
              offeredAmount={summary.avgAmount}
              markerLabel={null}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-[0.75rem] text-ink-3">
            <span>제안 {summary.count}건</span>
            <span>{summary.avgAmount != null ? `평균 ${toManwon(summary.avgAmount)}만원` : ""}</span>
          </div>
        </>
      ) : (
        <p className="mt-[1.125rem] text-[0.8125rem] text-ink-3">
          제안 {summary.count}건 · 견적은 상담에서 안내돼요
        </p>
      )}

      <ul className="mt-[1.125rem] hidden border-t border-line-2 md:block">
        {summary.items.map((item) => (
          <li
            key={item.proposalId}
            className="flex items-center gap-3 border-b border-line-2 py-3.5"
          >
            <Avatar
              name={item.nickname}
              className="shrink-0 border border-line bg-paper text-[2.25rem] text-ink-2"
            />
            <div className="min-w-0">
              <p className="truncate text-[0.875rem] font-semibold text-ink">
                {item.nickname} 사정사
              </p>
              <p className="truncate text-[0.75rem] text-ink-3">
                경력 {item.career}년 · {item.speciality} 전문
              </p>
            </div>
            {item.estimateMaxAmount != null && item.estimateMaxAmount === summary.maxAmount && (
              <span className="shrink-0 rounded-tag bg-gold-soft px-[0.4375rem] py-[0.1875rem] text-[0.6875rem] font-semibold text-gold-ink">
                최고가
              </span>
            )}
            {item.estimateMaxAmount != null ? (
              <span
                className={`ml-auto font-serif text-base font-bold ${item.estimateMaxAmount === summary.maxAmount ? "text-gold-ink" : "text-ink"}`}
              >
                {toManwon(item.estimateMaxAmount)}만원
              </span>
            ) : (
              <span className="ml-auto text-[0.8125rem] text-ink-3">견적 미제시</span>
            )}
          </li>
        ))}
      </ul>

      <Link
        href={DASHBOARD_LINKS.proposalsList}
        className="mt-4 flex w-full items-center justify-center rounded-button border border-line bg-paper-2 p-[0.8125rem] text-center text-sm font-semibold text-ink transition hover:brightness-[.98]"
      >
        제안 {summary.count}건 비교하기
      </Link>
    </section>
  );
}
