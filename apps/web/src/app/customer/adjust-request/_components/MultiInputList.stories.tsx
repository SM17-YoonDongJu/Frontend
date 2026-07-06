import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { MultiInputList } from "./MultiInputList";

const meta: Meta<typeof MultiInputList> = {
  title: "adjust-request/MultiInputList",
  component: MultiInputList,
  decorators: [
    (Story) => (
      <div className="w-[23rem]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MultiInputList>;

function Demo({ initial }: { initial: string[] }) {
  const [values, setValues] = useState(initial);
  return (
    <MultiInputList
      label="진단명"
      addLabel="진단명 추가"
      placeholder="예) 우측 슬관절 골절"
      values={values}
      onChange={setValues}
    />
  );
}

export const Empty: Story = { render: () => <Demo initial={[""]} /> };
export const Filled: Story = {
  render: () => <Demo initial={["우측 슬관절 후방십자인대 파열", ""]} />,
};
