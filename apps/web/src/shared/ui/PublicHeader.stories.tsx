import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PublicHeader } from "./PublicHeader";

const meta = {
  title: "UI/PublicHeader",
  component: PublicHeader,
  parameters: { layout: "fullscreen" }
} satisfies Meta<typeof PublicHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** 모바일 폭(네비 숨김, 로고 + CTA만) 확인용. */
export const Mobile: Story = {
  globals: { viewport: { value: "mobile1" } }
};
