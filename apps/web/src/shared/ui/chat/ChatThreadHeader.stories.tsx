import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { AlertTriangle } from "@/shared/ui/icons/AlertTriangle";
import { ArrowRight } from "@/shared/ui/icons/ArrowRight";
import { CheckCircle } from "@/shared/ui/icons/CheckCircle";
import { FileText } from "@/shared/ui/icons/FileText";
import { X } from "@/shared/ui/icons/X";
import { ChatThreadHeader, type ChatThreadHeaderMenuAction } from "./ChatThreadHeader";
import { MatchStatusBadge } from "./MatchStatusBadge";

const reportAction: ChatThreadHeaderMenuAction = {
  key: "report",
  label: "리포트 보기",
  icon: <FileText />,
  href: "#",
};

const reportChatAction: ChatThreadHeaderMenuAction = {
  key: "report-chat",
  label: "신고",
  icon: <AlertTriangle />,
  onClick: () => {},
};

const meta = {
  title: "UI/Chat/ChatThreadHeader",
  component: ChatThreadHeader,
  parameters: { layout: "fullscreen" },
  args: {
    name: "김도현 손해사정사",
    caseNo: "#20260520-017",
    roomStatus: "ACTIVE",
    menuActions: [reportAction],
  },
} satisfies Meta<typeof ChatThreadHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 액션 1개 — 더보기 안에 리포트 보기만. */
export const Default: Story = {};

export const WithBack: Story = { args: { onBack: () => {} } };

export const Closed: Story = {
  args: { name: "윤지후 손해사정사", roomStatus: "CLOSED", caseNo: "#20260428-003" },
};

/** customer — 아바타·이름 묶음이 사정사 프로필 링크. partner는 profileHref 미전달로 링크 없음. */
export const WithProfileLink: Story = {
  args: { profileHref: "/customer/adjusters/aaaaaaaa-1111-1111-1111-111111111111" },
};

/** partner — 리포트 보기 + 상담 종료(danger) + 신고. */
export const PartnerActions: Story = {
  args: {
    menuActions: [
      reportAction,
      {
        key: "close",
        label: "상담 종료",
        icon: <X />,
        onClick: () => {},
        tone: "danger",
      },
      reportChatAction,
    ],
  },
};

/** 액션 4개(풀세트) — customer 비교 중: 리포트 보기 + 매칭 완료 + 매칭 거절(danger) + 신고. */
export const CustomerComparing: Story = {
  args: {
    subtitle: "#20260520-017 · 상담 중 · 비교 중",
    menuActions: [
      reportAction,
      { key: "accept", label: "매칭 완료", icon: <CheckCircle />, onClick: () => {} },
      {
        key: "reject",
        label: "매칭 거절",
        icon: <X />,
        onClick: () => {},
        tone: "danger",
      },
      reportChatAction,
    ],
  },
};

/** 펼친 상태 — 더보기를 눌러 패널이 아코디언으로 열린 모습(대화를 아래로 민다). */
export const MenuOpen: Story = {
  args: CustomerComparing.args,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "더보기" }));
    await expect(canvas.getByRole("menuitem", { name: "매칭 완료" })).toBeVisible();
  },
};

/** 매칭 후 — 배지 + 사건 진행 보기 링크 항목. */
export const CustomerMatched: Story = {
  args: {
    subtitle: "#20260520-017 · 매칭 완료 · 진행 중",
    badge: <MatchStatusBadge group="matched" />,
    menuActions: [
      reportAction,
      { key: "progress", label: "사건 진행 보기", icon: <ArrowRight />, href: "#" },
      reportChatAction,
    ],
  },
};

/** 모바일 — 데스크톱과 동일하게 더보기 하나로 통합(아이콘 버튼 없음). */
export const MobileMenuOpen: Story = {
  parameters: { viewport: { defaultViewport: "mobile1" } },
  args: { ...CustomerComparing.args, onBack: () => {} },
  play: MenuOpen.play,
};
