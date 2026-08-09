import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Toggle } from "./Toggle";

const meta = {
  title: "ui/Toggle",
  component: Toggle,
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo({ disabled }: { disabled?: boolean }) {
  const [checked, setChecked] = useState(true);
  return (
    <Toggle
      checked={checked}
      onChange={setChecked}
      disabled={disabled}
      label="새 검수 요청 알림"
    />
  );
}

export const Default: Story = {
  args: { checked: true, onChange: () => {} },
  render: () => <Demo />,
};

export const Disabled: Story = {
  args: { checked: true, onChange: () => {} },
  render: () => <Demo disabled />,
};

export const SettingsRow: Story = {
  args: { checked: true, onChange: () => {} },
  render: () => (
    <div className="w-80 rounded-card border border-line bg-card p-4">
      <Demo />
    </div>
  ),
};
