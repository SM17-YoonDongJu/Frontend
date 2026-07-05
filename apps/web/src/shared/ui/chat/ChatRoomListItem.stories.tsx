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
