import Link from "next/link";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowRight } from "@/shared/ui/icons/ArrowRight";
import { CheckCircle } from "@/shared/ui/icons/CheckCircle";
import { X } from "@/shared/ui/icons/X";
import { ChatThreadHeader } from "./ChatThreadHeader";
import { MatchStatusBadge } from "./MatchStatusBadge";

const meta = {
  title: "UI/Chat/ChatThreadHeader",
  component: ChatThreadHeader,
  parameters: { layout: "fullscreen" },
  args: {
    name: "김도현 손해사정사",
    caseNo: "#20260520-017",
    roomStatus: "ACTIVE",
    reportHref: "#",
  },
} satisfies Meta<typeof ChatThreadHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithBack: Story = { args: { onBack: () => {} } };

export const Closed: Story = {
  args: { name: "윤지후 손해사정사", roomStatus: "CLOSED", caseNo: "#20260428-003" },
};

/** partner 하위호환 — onClose(상담 종료) 시그니처 그대로. */
export const PartnerClose: Story = { args: { onClose: () => {} } };

/** customer 비교중 — 리포트 보기 + 매칭 거절(terra) + 매칭 완료(ink). */
export const CustomerComparing: Story = {
  args: {
    subtitle: "#20260520-017 · 상담 중 · 비교 중",
    actions: (
      <>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full bg-terra px-3.5 py-1.5 text-[0.8125rem] font-semibold text-white transition hover:brightness-[.96]"
        >
          매칭 거절
          <X className="text-[0.875rem]" />
        </button>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-[0.8125rem] font-semibold text-white transition hover:brightness-[.96]"
        >
          매칭 완료
          <CheckCircle className="text-[0.9375rem]" />
        </button>
      </>
    ),
  },
};

/** customer 매칭후 — 매칭 완료 배지 + 리포트 보기 + 사건 진행 보기(ink). */
export const CustomerMatched: Story = {
  args: {
    subtitle: "#20260520-017 · 매칭 완료 · 진행 중",
    badge: <MatchStatusBadge group="matched" />,
    actions: (
      <Link
        href="#"
        className="flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-[0.8125rem] font-semibold text-white transition hover:brightness-[.96]"
      >
        사건 진행 보기
        <ArrowRight className="text-[0.9375rem]" />
      </Link>
    ),
  },
};
