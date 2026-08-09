import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CustomerHeader } from "./CustomerHeader";

const meta = {
  title: "UI/CustomerHeader",
  component: CustomerHeader,
  parameters: { layout: "fullscreen" }
} satisfies Meta<typeof CustomerHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** 모바일 폭(네비 숨김, 로고 + 알림/계정만) 확인용. */
export const Mobile: Story = {
  globals: { viewport: { value: "mobile1" } }
};
