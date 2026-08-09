import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { StarRatingInput } from "./StarRatingInput";

const meta = {
  title: "ui/StarRatingInput",
  component: StarRatingInput,
} satisfies Meta<typeof StarRatingInput>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo({ size }: { size?: "lg" | "sm" }) {
  const [value, setValue] = useState(0);
  return <StarRatingInput value={value} onChange={setValue} size={size} label="전체 만족도" />;
}

export const Large: Story = {
  args: { value: 0, onChange: () => {}, label: "전체 만족도" },
  render: () => <Demo size="lg" />,
};

export const Small: Story = {
  args: { value: 0, onChange: () => {}, label: "세부 평가" },
  render: () => <Demo size="sm" />,
};

export const Preselected: Story = {
  args: { value: 4, onChange: () => {}, label: "전체 만족도" },
  render: () => {
    const [value, setValue] = useState(4);
    return <StarRatingInput value={value} onChange={setValue} label="전체 만족도" />;
  },
};
