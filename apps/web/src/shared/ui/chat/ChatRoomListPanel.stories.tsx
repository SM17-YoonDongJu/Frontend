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
    proposalId: "cccccccc-1111-1111-1111-111111111111",
    matchStatus: "COUNSELING",
    reportTypeLabel: "후유장해",
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
    proposalId: "cccccccc-2222-2222-2222-222222222222",
    matchStatus: "COUNSELING",
    reportTypeLabel: "후유장해",
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
    proposalId: "cccccccc-3333-3333-3333-333333333333",
    matchStatus: "REJECTED",
    reportTypeLabel: "후유장해",
  },
];

const meta: Meta<typeof ChatRoomListPanel> = {
  title: "UI/Chat/ChatRoomListPanel",
  component: ChatRoomListPanel,
  parameters: { layout: "fullscreen" },
  args: { rooms, buildHref: (id: string) => `/customer/chat/${id}` },
  decorators: [
    (Story) => (
      <div className="h-[35rem] max-w-[26.25rem] border border-line">
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

/** customer — 매칭 그룹 섹션(매칭 완료 1 / 비교 1 / 종료 1). */
export const Grouped: Story = {
  args: {
    grouped: true,
    activeChatRoomId: "11111111-1111-1111-1111-111111111111",
    rooms: rooms.map((room, index) => ({
      ...room,
      roomStatus: index === 2 ? "CLOSED" : "ACTIVE",
      matchStatus:
        index === 0 ? "ACCEPTED" : index === 2 ? "REJECTED" : "COUNSELING",
    })),
  },
};

/** customer 모바일 — 비교 3명 그룹 + 상단 비교 배너(mobile1 뷰포트에서 배너 노출). */
export const GroupedComparing: Story = {
  parameters: { viewport: { defaultViewport: "mobile1" } },
  args: {
    grouped: true,
    rooms: rooms.map((room) => ({
      ...room,
      roomStatus: "ACTIVE",
      matchStatus: "COUNSELING",
    })),
  },
};

export const Empty: Story = { args: { rooms: [] } };

export const EmptyWithAction: Story = {
  args: {
    rooms: [],
    emptyAction: { href: "/customer/adjusters", label: "손해사정사 찾아보기" },
  },
};
