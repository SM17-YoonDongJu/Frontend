import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FunnelFooter } from "./FunnelFooter";

const meta = {
  title: "adjust-request/FunnelFooter",
  component: FunnelFooter,
  args: { isFirst: false, isLast: false, onPrev: () => {}, onNext: () => {} },
} satisfies Meta<typeof FunnelFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Middle: Story = {};
export const FirstStep: Story = { args: { isFirst: true } };
export const LastStep: Story = { args: { isLast: true } };
export const Submitting: Story = { args: { isLast: true, loading: true } };
