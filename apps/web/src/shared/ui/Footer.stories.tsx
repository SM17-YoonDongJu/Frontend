import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Footer } from "./Footer";

const meta = {
  title: "UI/Footer",
  component: Footer,
  parameters: { layout: "fullscreen" }
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** 모바일 폭(2단 그리드) 확인용. */
export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: "mobile1" } }
};
