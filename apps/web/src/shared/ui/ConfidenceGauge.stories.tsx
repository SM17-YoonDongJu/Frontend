import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ConfidenceGauge } from "./ConfidenceGauge";

const meta = {
  title: "UI/ConfidenceGauge",
  component: ConfidenceGauge,
  parameters: { layout: "padded" },
  args: { level: "HIGH" },
  argTypes: {
    level: { control: "select", options: ["LOW", "MEDIUM", "HIGH"] },
  },
} satisfies Meta<typeof ConfidenceGauge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
};

export const Levels: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <ConfidenceGauge level="LOW" />
      <ConfidenceGauge level="MEDIUM" />
      <ConfidenceGauge level="HIGH" />
    </div>
  ),
};
