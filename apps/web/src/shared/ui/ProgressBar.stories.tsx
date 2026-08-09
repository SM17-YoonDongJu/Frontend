import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProgressBar } from "./ProgressBar";

const meta = {
  title: "UI/ProgressBar",
  component: ProgressBar,
  parameters: { layout: "padded" },
  args: { value: 2, max: 3, tone: "gold", label: "쟁점 검토 진행" },
  argTypes: {
    tone: { control: "select", options: ["gold", "navy", "green"] },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
};

export const Tones: Story = {
  render: () => (
    <div style={{ display: "flex", width: 320, flexDirection: "column", gap: 16 }}>
      <ProgressBar value={2} max={3} tone="gold" />
      <ProgressBar value={1} max={3} tone="navy" />
      <ProgressBar value={3} max={3} tone="green" />
    </div>
  ),
};

export const Empty: Story = { args: { value: 0, max: 3 } };
export const Full: Story = { args: { value: 3, max: 3 } };
