"use client";

import { useMemo } from "react";
import { useReceivedProposals } from "@/app/customer/_shared/api/use-received-proposals";
import { ReceivedProposalCard } from "./ReceivedProposalCard";
import { ReceivedProposalsEmpty } from "./ReceivedProposalsEmpty";

export function ReceivedProposalsView() {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useReceivedProposals();

  const list = useMemo(() => data.pages.flatMap((page) => page.list), [data.pages]);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[25.125rem] flex-col bg-paper md:min-h-0 md:max-w-6xl md:px-6 md:py-10">
      <div className="flex-1">
        <header className="px-5 pt-6 pb-4 md:px-0 md:pt-0 md:pb-8">
          <h1 className="font-serif text-[1.625rem] font-bold leading-[1.3] tracking-[-0.0144rem] text-ink md:text-[2rem]">
            받은 제안
          </h1>
          <p className="mt-2 text-[0.8125rem] leading-[1.45] text-ink-3 md:text-[0.9375rem]">
            분석 요청건별로 도착한 제안을 모아 보여드려요.
          </p>
        </header>

        {list.length === 0 ? (
          <ReceivedProposalsEmpty />
        ) : (
          <>
            <ul className="flex flex-col gap-3 px-5 pb-5 md:grid md:grid-cols-2 md:items-start md:gap-6 md:px-0 md:pb-8">
              {list.map((item) => (
                <li key={item.reportId}>
                  <ReceivedProposalCard item={item} />
                </li>
              ))}
            </ul>

            {hasNextPage && (
              <div className="px-5 pb-4 md:mx-auto md:w-full md:max-w-[25.125rem] md:px-0 md:pb-6">
                <button
                  type="button"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="w-full rounded-button border border-line bg-card py-3 text-[0.875rem] font-semibold text-ink-2 transition hover:brightness-[.98] disabled:cursor-not-allowed disabled:opacity-[.42]"
                >
                  {isFetchingNextPage ? "불러오는 중…" : "더보기"}
                </button>
              </div>
            )}

            <p className="px-5 pb-6 text-center text-[0.6875rem] leading-[1.5] text-ink-3 md:px-0 md:text-[0.75rem]">
              요청건을 선택하면 해당 리포트에 도착한 제안 목록으로 이동합니다.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
