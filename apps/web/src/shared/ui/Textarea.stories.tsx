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

function InsideCounterDemo() {
  const [value, setValue] = useState("");
  return (
    <div className="w-[32rem]">
      <Textarea
        value={value}
        onChange={setValue}
        maxLength={500}
        rows={8}
        counterPlacement="inside"
        resizable={false}
      />
    </div>
  );
}

export const InsideCounter: Story = {
  args: { value: "", onChange: () => {} },
  render: () => <InsideCounterDemo />,
};

/** 제출 중 등 입력 잠금. */
export const Disabled: Story = {
  args: {
    value: "상담 중 반복적인 욕설이 있었습니다.",
    onChange: () => {},
    maxLength: 500,
    rows: 4,
    disabled: true,
  },
};
