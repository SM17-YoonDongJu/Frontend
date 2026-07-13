import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ChatMessage } from "@/shared/api/chat/chat.schema";
import { ChatThreadView } from "./ChatThreadView";

const ME = "1024";
const OTHER = "adjuster-1";

const messages: ChatMessage[] = [
  {
    messageId: "00000000-0000-0000-0000-000000000001",
    senderId: OTHER,
    content: "안녕하세요, 윤서님. 리포트 잘 봤습니다. 후방십자인대 파열 건 맞으실까요?",
    createdAt: "2026-05-21T14:38:00+09:00",
  },
  {
    messageId: "00000000-0000-0000-0000-000000000002",
    senderId: ME,
    content: "네 맞아요. 850만원 제안받았는데 너무 낮은 것 같아서요.",
    createdAt: "2026-05-21T14:40:00+09:00",
  },
  {
    messageId: "00000000-0000-0000-0000-000000000003",
    senderId: OTHER,
    content: "장해분류표 기준으로 12급 적용 여지가 있어 보여요.",
    createdAt: "2026-05-22T09:10:00+09:00",
  },
];

const meta: Meta<typeof ChatThreadView> = {
  title: "UI/Chat/ChatThreadView",
  component: ChatThreadView,
  parameters: { layout: "fullscreen" },
  args: { messages, currentUserId: ME },
  decorators: [
    (Story) => (
      <div style={{ height: 480, display: "flex", flexDirection: "column" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ChatThreadView>;

export const Default: Story = {};

export const Empty: Story = { args: { messages: [] } };

/** 커서가 남아 상단에 이전 대화 안내가 보이는 상태 */
export const HasOlder: Story = {
  args: { hasOlder: true, onLoadOlder: () => {} },
};

export const LoadingOlder: Story = {
  args: { hasOlder: true, onLoadOlder: () => {}, loadingOlder: true },
};
