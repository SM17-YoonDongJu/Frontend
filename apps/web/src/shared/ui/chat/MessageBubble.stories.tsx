import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MessageBubble } from "./MessageBubble";

const meta = {
  title: "UI/Chat/MessageBubble",
  component: MessageBubble,
  parameters: { layout: "padded" },
  args: {
    content: "안녕하세요, 윤서님. 리포트 잘 봤습니다. 후방십자인대 파열 건 맞으실까요?",
    createdAt: "2026-05-21T14:38:00+09:00",
    mine: false,
  },
} satisfies Meta<typeof MessageBubble>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Theirs: Story = {};

export const Mine: Story = {
  args: {
    content: "네 맞아요. 850만원 제안받았는데 너무 낮은 것 같아서요.",
    mine: true,
  },
};

export const Conversation: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <MessageBubble
        content="안녕하세요, 윤서님. 리포트 잘 봤습니다."
        createdAt="2026-05-21T14:38:00+09:00"
        mine={false}
      />
      <MessageBubble
        content="네 맞아요. 850만원 제안받았는데 너무 낮은 것 같아서요."
        createdAt="2026-05-21T14:40:00+09:00"
        mine
      />
    </div>
  ),
};

/** 첨부 파일 칩(⚠️ 명세없음-초안) — 파일명·아이콘 표시 */
export const WithAttachment: Story = {
  args: {
    content: "요청하신 진단서 보내드려요.",
    mine: true,
    attachments: [
      {
        attachmentId: "00000000-0000-4000-8000-00000000a001",
        fileName: "진단서.pdf",
        mimeType: "application/pdf",
        url: "https://mock.local/chat-uploads/진단서.pdf",
      },
    ],
  },
};
