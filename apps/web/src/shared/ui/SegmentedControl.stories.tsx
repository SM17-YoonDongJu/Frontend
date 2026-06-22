import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { SegmentedControl } from "./SegmentedControl";

const OPTIONS = [
  { value: "ACCEPTED", label: "인정" },
  { value: "MODIFIED", label: "수정" },
  { value: "EXCLUDED", label: "제외" },
];

const meta = {
  title: "UI/SegmentedControl",
  component: SegmentedControl,
  parameters: { layout: "centered" },
  args: { options: OPTIONS, value: "ACCEPTED", onChange: () => {} },
} satisfies Meta<typeof SegmentedControl<string>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>("ACCEPTED");
    return (
      <SegmentedControl
        aria-label="쟁점 검수 상태"
        options={OPTIONS}
        value={value}
        onChange={setValue}
      />
    );
  },
};

export const Unselected: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>(null);
    return <SegmentedControl options={OPTIONS} value={value} onChange={setValue} />;
  },
};

export const Small: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>("MODIFIED");
    return <SegmentedControl size="sm" options={OPTIONS} value={value} onChange={setValue} />;
  },
};
