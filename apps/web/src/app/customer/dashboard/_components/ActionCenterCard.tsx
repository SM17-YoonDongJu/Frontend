"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "@/shared/ui/icons/ChevronRight";
import { MessageSquare } from "@/shared/ui/icons/MessageSquare";
import { FileText } from "@/shared/ui/icons/FileText";
import { useChatList } from "@/shared/api/chat/use-chat-list";
import type { ChatRoom } from "@/shared/api/chat/chat.schema";
import { useDashboard } from "../_api/use-dashboard";
import { useReportAnalysisState } from "../_api/use-report-analysis-state";
import type { DashboardActiveReport, DashboardProposalSummary } from "../_model/dashboard.schema";
import { DASHBOARD_LINKS } from "../_model/dashboard-links";
import { reportDisplayTitle } from "@/app/customer/_shared/model/report-title";
import type { AnalysisState } from "@/app/customer/_shared/model/analysis-state";
import { formatManwon } from "@/shared/lib/format-amount";

const MAX_SUB_TODOS = 2;

interface ActionTodo {
  key: string;
  href: string;
  heading: ReactNode;
  description: ReactNode;
  ctaLabel: string;
  subIcon: ReactNode;
  subTitle: string;
  subDescription: string;
}

// BFF는 reportCount·activeReport·proposalSummary만 내려줌 — 할 일은 제안 집계·채팅 미읽음에서 파생.
function buildTodos(
  activeReport: DashboardActiveReport | null,
  proposalSummary: DashboardProposalSummary | null,
  unreadRoom: ChatRoom | null
): ActionTodo[] {
  const list: ActionTodo[] = [];

  if (proposalSummary && proposalSummary.count > 0) {
    const count = proposalSummary.count;
    list.push({
      key: "proposal",
      href: DASHBOARD_LINKS.allReports,
      heading: (
        <>
          새 제안 <span className="text-gold-2">{count}건</span>이 도착했어요
        </>
      ),
      description:
        activeReport && proposalSummary.maxAmount != null ? (
          <>
            {reportDisplayTitle(activeReport)} · 최고 제안가{" "}
            <span className="font-bold text-gold-2">
              {formatManwon(proposalSummary.maxAmount)}만원
            </span>{" "}
            — 제안을 비교하고 나에게 맞는 사정사를 선택해 보세요.
          </>
        ) : (
          <>받은 제안을 비교하고 나에게 맞는 사정사를 선택해 보세요.</>
        ),
      ctaLabel: "제안 비교하기",
      subIcon: <FileText className="text-[1rem]" />,
      subTitle: `새 제안 ${count}건 도착`,
      subDescription: activeReport ? reportDisplayTitle(activeReport) : "받은 제안 확인"
    });
  }

  if (unreadRoom) {
    const description = unreadRoom.lastMessage
      ? `“${unreadRoom.lastMessage}”`
      : "새 메시지를 확인해 보세요.";
    list.push({
      key: "chat",
      href: DASHBOARD_LINKS.chatRoom(unreadRoom.chatRoomId),
      heading: (
        <>
          {unreadRoom.counterpart.name} <span className="text-gold-2">새 메시지</span>
        </>
      ),
      description: <>{description}</>,
      ctaLabel: "채팅 열기",
      subIcon: <MessageSquare className="text-[1rem]" />,
      subTitle: `${unreadRoom.counterpart.name} 새 메시지`,
      subDescription: description
    });
  }

  return list;
}

function buildInfoTodo(
  activeReport: DashboardActiveReport,
  analysisState: AnalysisState | undefined,
): ActionTodo {
  const title = reportDisplayTitle(activeReport);
  // 분석이 끝난 리포트만 결과를 볼 수 있다고 알린다. 상태를 모르면(목록 미조회·첫 페이지 밖) 중립 문구.
  const isAnalyzed = analysisState === "COMPLETED";

  return {
    key: "info",
    href: DASHBOARD_LINKS.report(activeReport.reportId),
    heading: isAnalyzed ? (
      <>
        AI 분석 결과를 <span className="text-gold-2">확인</span>해보세요
      </>
    ) : (
      <>
        분석 현황을 <span className="text-gold-2">확인</span>해보세요
      </>
    ),
    description: isAnalyzed ? (
      <>
        {title}의 AI 분석 결과를 리포트에서 볼 수 있어요. 사정사 검수가 끝나면 의견과 제안을
        알려드릴게요.
      </>
    ) : (
      <>
        {title}의 분석이 끝나면 AI 분석 결과를 리포트에서 바로 볼 수 있어요. 사정사 검수가 끝나면
        의견과 제안을 알려드릴게요.
      </>
    ),
    ctaLabel: "리포트 상세",
    subIcon: <FileText className="text-[1rem]" />,
    subTitle: title,
    subDescription: isAnalyzed ? "AI 분석 완료 · 검수 대기" : "분석 · 검수 대기",
  };
}

export function ActionCenterCard() {
  const { data } = useDashboard();
  const { data: chatRooms } = useChatList();
  const unreadRoom = chatRooms.find((room) => room.unreadCount > 0) ?? null;
  const todos = buildTodos(data.activeReport, data.proposalSummary, unreadRoom);
  const analysisState = useReportAnalysisState(data.activeReport?.reportId ?? null);

  let main: ActionTodo | null = null;
  let subTodos: ActionTodo[] = [];

  if (todos.length > 0) {
    main = todos[0] ?? null;
    subTodos = todos.slice(1, 1 + MAX_SUB_TODOS);
  } else if (data.activeReport) {
    main = buildInfoTodo(data.activeReport, analysisState);
  }

  if (!main) return null;

  return (
    <section className="relative overflow-hidden rounded-card-lg bg-navy px-6 py-6 md:px-9 md:py-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 right-16 hidden size-72 rounded-full bg-gold-2/10 md:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-24 top-36 hidden size-56 rounded-full border border-gold-2/25 md:block"
      />

      <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:gap-9">
        <div className="md:flex-1">
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-gold-2/15 px-2.5 py-1">
            <span className="size-1.5 rounded-full bg-gold-2" />
            <span className="text-[0.75rem] font-semibold text-gold-2">지금 할 일</span>
          </span>

          <h2 className="mt-4 font-serif text-2xl font-bold text-white">{main.heading}</h2>
          <p className="mt-2.5 text-sm leading-[1.6] text-white/60">{main.description}</p>

          <Link
            href={main.href}
            className="mt-5 inline-flex w-full items-center justify-center rounded-button bg-gold px-6 py-3 text-sm font-semibold text-white transition hover:brightness-[.96] md:w-auto"
          >
            {main.ctaLabel}
          </Link>
        </div>

        {subTodos.length > 0 && (
          <div className="flex flex-col gap-2.5 md:w-80">
            {subTodos.map((todo) => (
              <Link
                key={todo.key}
                href={todo.href}
                className="flex items-center gap-3 rounded-card border border-white/10 bg-white/5 px-[1.0625rem] py-[0.9375rem] transition hover:bg-white/10"
              >
                <span className="flex size-[2.125rem] shrink-0 items-center justify-center rounded-chip bg-gold-2/15 text-gold-2">
                  {todo.subIcon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.8125rem] font-semibold text-white">
                    {todo.subTitle}
                  </span>
                  <span className="mt-0.5 block truncate text-[0.75rem] text-white/55">
                    {todo.subDescription}
                  </span>
                </span>
                <ChevronRight className="shrink-0 text-[0.9375rem] text-white/45" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
