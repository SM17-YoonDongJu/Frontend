import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ChatRoom } from "@/shared/api/chat/chat.schema";
import { ChatRoomListPanel } from "./ChatRoomListPanel";

const rooms: ChatRoom[] = [
  {
    chatRoomId: "11111111-1111-1111-1111-111111111111",
    lastMessage: "장해진단서 발급받으시면 바로 검토해드릴게요.",
    updatedAt: new Date().toISOString(),
    adjusterId: "aaaaaaaa-1111-1111-1111-111111111111",
    adjusterName: "김도현 손해사정사",
    avatarUrl: null,
    reportId: "rrrrrrrr-1111-1111-1111-111111111111",
    caseNo: "#20260520-017",
    roomStatus: "ACTIVE",
    lastMessageAt: new Date().toISOString(),
  },
  {
    chatRoomId: "22222222-2222-2222-2222-222222222222",
    lastMessage: "네, 외모추상 특약도 함께 보겠습니다.",
    updatedAt: "2026-05-20T09:00:00+09:00",
    adjusterId: "aaaaaaaa-2222-2222-2222-222222222222",
    adjusterName: "정우성 손해사정사",
    avatarUrl: null,
    reportId: "rrrrrrrr-2222-2222-2222-222222222222",
    caseNo: "#20260512-009",
    roomStatus: "ACTIVE",
    lastMessageAt: "2026-05-20T09:00:00+09:00",
  },
  {
    chatRoomId: "33333333-3333-3333-3333-333333333333",
    lastMessage: "상담이 종료되었습니다.",
    updatedAt: "2026-04-28T09:00:00+09:00",
    adjusterId: "aaaaaaaa-3333-3333-3333-333333333333",
    adjusterName: "윤지후 손해사정사",
    avatarUrl: null,
    reportId: "rrrrrrrr-3333-3333-3333-333333333333",
    caseNo: "#20260428-003",
    roomStatus: "CLOSED",
    lastMessageAt: "2026-04-28T09:00:00+09:00",
  },
];

const meta: Meta<typeof ChatRoomListPanel> = {
  title: "UI/Chat/ChatRoomListPanel",
  component: ChatRoomListPanel,
  parameters: { layout: "fullscreen" },
  args: { rooms, buildHref: (id: string) => `/customer/chat/${id}` },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 420, height: 560, border: "1px solid #e6e0d4" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ChatRoomListPanel>;

export const Default: Story = {};

export const ActiveRow: Story = {
  args: { activeChatRoomId: "11111111-1111-1111-1111-111111111111" },
};

export const Empty: Story = { args: { rooms: [] } };
