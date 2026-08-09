import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FUNNEL_TOTAL } from "../_model/funnel-config";
import { FunnelProgress } from "./FunnelProgress";

const meta = {
  title: "adjust-request/FunnelProgress",
  component: FunnelProgress,
  args: { total: FUNNEL_TOTAL, onBack: () => {} },
} satisfies Meta<typeof FunnelProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Step1: Story = { args: { current: 1, title: "사고 유형", isFirst: true } };
export const Step3: Story = { args: { current: 3, title: "사고 일자" } };
export const Step5: Story = { args: { current: 5, title: "전할 말" } };
export const Step7: Story = { args: { current: FUNNEL_TOTAL, title: "확인" } };
