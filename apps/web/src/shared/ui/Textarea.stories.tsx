import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Textarea } from "./Textarea";

const meta = {
  title: "ui/Textarea",
  component: Textarea,
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo() {
  const [value, setValue] = useState("");
  return (
    <div className="w-[32rem]">
      <Textarea
        value={value}
        onChange={setValue}
        maxLength={1000}
        placeholder="진행 과정, 결과, 소통 경험 등을 자유롭게 남겨주세요."
        counterHint=" · 개인정보(연락처 등)는 적지 말아 주세요"
      />
    </div>
  );
}

export const Default: Story = {
  args: { value: "", onChange: () => {} },
  render: () => <Demo />,
};
