import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FunnelProgress } from "./FunnelProgress";

const meta = {
  title: "adjust-request/FunnelProgress",
  component: FunnelProgress,
  args: { total: 6, onBack: () => {} },
} satisfies Meta<typeof FunnelProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Step1: Story = { args: { current: 1, title: "사고 유형", isFirst: true } };
export const Step3: Story = { args: { current: 3, title: "사고 일자" } };
export const Step6: Story = { args: { current: 6, title: "확인" } };
