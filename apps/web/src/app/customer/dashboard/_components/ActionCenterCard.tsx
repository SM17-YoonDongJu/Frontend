"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "@/shared/ui/icons/ChevronRight";
import { CheckCircle } from "@/shared/ui/icons/CheckCircle";
import { MessageSquare } from "@/shared/ui/icons/MessageSquare";
import { FileText } from "@/shared/ui/icons/FileText";
import { useDashboard } from "../_api/use-dashboard";
import type {
  DashboardActiveReport,
  DashboardProposalSummary,
  DashboardTodos,
} from "../_model/dashboard.schema";
import { DASHBOARD_LINKS } from "../_model/dashboard-links";
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

function buildTodos(
  todos: DashboardTodos,
  activeReport: DashboardActiveReport | null,
  proposalSummary: DashboardProposalSummary | null,
): ActionTodo[] {
  const list: ActionTodo[] = [];

  if (todos.unreadProposalCount > 0) {
    const count = todos.unreadProposalCount;
    list.push({
      key: "proposal",
      href: DASHBOARD_LINKS.proposalsList,
      heading: (
        <>
          새 제안 <span className="text-gold-2">{count}건</span>이 도착했어요
        </>
      ),
      description:
        activeReport && proposalSummary ? (
          <>
            {activeReport.title} · 최고 제안가{" "}
            <span className="font-bold text-gold-2">{formatManwon(proposalSummary.maxAmount)}만원</span>{" "}
            — 제안을 비교하고 나에게 맞는 사정사를 선택해 보세요.
          </>
        ) : (
          <>받은 제안을 비교하고 나에게 맞는 사정사를 선택해 보세요.</>
        ),
      ctaLabel: "제안 비교하기",
      subIcon: <FileText className="text-[1rem]" />,
      subTitle: `새 제안 ${count}건 도착`,
      subDescription: activeReport?.title ?? "받은 제안 확인",
    });
  }

  if (todos.unreadReviewCompleteCount > 0) {
    const count = todos.unreadReviewCompleteCount;
    list.push({
      key: "review",
      href: DASHBOARD_LINKS.allReports,
      heading: (
        <>
          검수 완료 리포트 <span className="text-gold-2">{count}건</span>
        </>
      ),
      description: <>검수가 끝난 리포트에서 예상 보상 범위와 쟁점을 확인해 보세요.</>,
      ctaLabel: "리포트 확인",
      subIcon: <CheckCircle className="text-[1rem]" />,
      subTitle: `검수 완료 리포트 ${count}건`,
      subDescription: "검수 결과 확인",
    });
  }

  const { unreadChat } = todos;
  if (unreadChat) {
    list.push({
      key: "chat",
      href: DASHBOARD_LINKS.chatRoom(unreadChat.chatRoomId),
      heading: (
        <>
          {unreadChat.adjusterNickname} 사정사 <span className="text-gold-2">새 메시지</span>
        </>
      ),
      description: <>“{unreadChat.lastMessage}”</>,
      ctaLabel: "채팅 열기",
      subIcon: <MessageSquare className="text-[1rem]" />,
      subTitle: `${unreadChat.adjusterNickname} 사정사 새 메시지`,
      subDescription: `“${unreadChat.lastMessage}”`,
    });
  }

  return list;
}

function buildInfoTodo(activeReport: DashboardActiveReport): ActionTodo {
  return {
    key: "info",
    href: DASHBOARD_LINKS.report(activeReport.reportId),
    heading: (
      <>
        검수가 <span className="text-gold-2">진행 중</span>이에요
      </>
    ),
    description: (
      <>
        {activeReport.title} 검수를 진행하고 있어요. 결과가 준비되면 바로 알려드릴게요.
      </>
    ),
    ctaLabel: "리포트 상세",
    subIcon: <FileText className="text-[1rem]" />,
    subTitle: activeReport.title,
    subDescription: "검수 진행 중",
  };
}

export function ActionCenterCard() {
  const { data } = useDashboard();
  const todos = buildTodos(data.todos, data.activeReport, data.proposalSummary);

  let main: ActionTodo | null = null;
  let subTodos: ActionTodo[] = [];

  if (todos.length > 0) {
    main = todos[0] ?? null;
    subTodos = todos.slice(1, 1 + MAX_SUB_TODOS);
  } else if (data.activeReport) {
    main = buildInfoTodo(data.activeReport);
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
