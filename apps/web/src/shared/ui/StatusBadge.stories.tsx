import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StatusBadge } from "./StatusBadge";

const meta = {
  title: "UI/StatusBadge",
  component: StatusBadge,
  parameters: { layout: "centered" },
  args: { children: "검수 완료" },
  argTypes: {
    tone: { control: "select", options: ["neutral", "navy", "gold", "green", "terra"] },
  },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
      <StatusBadge tone="neutral">접수</StatusBadge>
      <StatusBadge tone="navy">검수 완료</StatusBadge>
      <StatusBadge tone="gold">신규</StatusBadge>
      <StatusBadge tone="green">확정</StatusBadge>
      <StatusBadge tone="terra">보완 필요</StatusBadge>
    </div>
  ),
};
