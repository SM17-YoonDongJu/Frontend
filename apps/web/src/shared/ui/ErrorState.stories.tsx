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

export const KnownCodeHidesRetry: Story = {
  args: {
    layout: "page",
    code: "FORBIDDEN",
    messages: {
      FORBIDDEN: { title: "접근 권한이 없어요", desc: "본인 리포트만 확인할 수 있어요." },
    },
  },
};
