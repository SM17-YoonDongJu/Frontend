import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChatRoomListItem } from "./ChatRoomListItem";

const meta: Meta<typeof ChatRoomListItem> = {
  title: "UI/Chat/ChatRoomListItem",
  component: ChatRoomListItem,
  parameters: { layout: "padded" },
  args: {
    name: "김도현 손해사정사",
    caseNo: "#20260520-017",
    lastMessage: "장해진단서 발급받으시면 바로 검토해드릴게요.",
    lastMessageAt: new Date().toISOString(),
    avatarUrl: null,
    roomStatus: "ACTIVE",
    href: "#",
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 380, border: "1px solid #e6e0d4", borderRadius: 16 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ChatRoomListItem>;

export const Default: Story = {};

export const Active: Story = { args: { active: true } };

export const Closed: Story = {
  args: {
    name: "윤지후 손해사정사",
    roomStatus: "CLOSED",
    lastMessage: "상담이 종료되었습니다.",
    lastMessageAt: "2026-05-19T10:00:00+09:00",
  },
};

export const NoMessage: Story = { args: { lastMessage: null } };

/** customer 매칭 완료 — 아바타 초록 체크 표식. */
export const Matched: Story = {
  args: { matchStatus: "ACCEPTED", lastMessage: "매칭 완료 · 자료 검토를 시작할게요." },
};

/** customer 종료(거절) — 행 흐림 처리. */
export const Ended: Story = {
  args: { matchStatus: "REJECTED", lastMessage: "상담이 종료됐어요." },
};

/** customer 그룹 목록 — 이름 옆 사건 유형 라벨("· 후유장해"). */
export const WithReportType: Story = {
  args: { matchStatus: "COUNSELING", reportTypeLabel: "후유장해" },
};
