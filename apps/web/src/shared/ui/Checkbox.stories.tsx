import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Checkbox } from "./Checkbox";

const meta = {
  title: "ui/Checkbox",
  component: Checkbox,
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo({ disabled }: { disabled?: boolean }) {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox
      checked={checked}
      onChange={setChecked}
      disabled={disabled}
      label="아직 제안받지 않았어요"
    />
  );
}

export const Default: Story = {
  args: { checked: false, onChange: () => {} },
  render: () => <Demo />,
};

export const Disabled: Story = {
  args: { checked: false, onChange: () => {} },
  render: () => <Demo disabled />,
};
