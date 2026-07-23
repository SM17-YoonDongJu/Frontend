import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ErrorState } from "./ErrorState";

const meta = {
  title: "UI/ErrorState",
  component: ErrorState,
  parameters: { layout: "centered" },
  args: {
    layout: "card",
    onRetry: () => {},
  },
  argTypes: {
    layout: { control: "select", options: ["card", "page", "flow", "fill"] },
  },
} satisfies Meta<typeof ErrorState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Card: Story = {
  args: { layout: "card", title: "정보를 불러오지 못했어요" },
};

export const Page: Story = {
  args: { layout: "page", title: "리포트를 불러오지 못했어요" },
};

export const Flow: Story = {
  args: { layout: "flow", title: "제안을 불러오지 못했어요" },
};

export const Fill: Story = {
  args: { layout: "fill", title: "대화를 불러오지 못했어요" },
};

export const WithCode: Story = {
  args: { layout: "card", title: "알림을 불러오지 못했어요", code: "INTERNAL_SERVER_ERROR" },
};

export const ForbiddenDefault: Story = {
  args: { layout: "page", code: "FORBIDDEN" },
};

export const ForbiddenCard: Story = {
  args: { layout: "card", code: "FORBIDDEN" },
};

export const ForbiddenWithOverride: Story = {
  args: {
    layout: "page",
    code: "FORBIDDEN",
    messages: {
      FORBIDDEN: { title: "접근 권한이 없어요", desc: "활성 손해사정사만 검수 내역을 볼 수 있어요." },
    },
  },
};

export const KnownCodeHidesRetry: Story = {
  args: {
    layout: "page",
    code: "NOT_FOUND",
    messages: {
      NOT_FOUND: { title: "리포트를 찾을 수 없어요", desc: "삭제됐거나 주소가 잘못됐어요." },
    },
  },
};
