import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "./Input";
import { Label } from "./Label";

const meta: Meta<typeof Label> = {
  title: "UI/Label",
  component: Label,
  parameters: { layout: "padded" }
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: { children: "진단명 · 상해 부위" }
};

export const Kicker: Story = {
  args: { kicker: true, children: "Design System" }
};

// 라벨 ↔ 인풋 연결 (htmlFor ↔ id)
export const WithInput: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 7, maxWidth: 360 }}>
      <Label htmlFor="diagnosis">진단명 · 상해 부위</Label>
      <Input id="diagnosis" placeholder="예) 경추 염좌" />
    </div>
  )
};
