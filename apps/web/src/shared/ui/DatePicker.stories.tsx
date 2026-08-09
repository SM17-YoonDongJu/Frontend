import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { DatePicker } from "./DatePicker";

const meta = {
  title: "ui/DatePicker",
  component: DatePicker,
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo({ error }: { error?: string }) {
  const [value, setValue] = useState<string | undefined>();
  return (
    <div className="w-[16.25rem]">
      <DatePicker value={value} onChange={(v) => setValue(v ?? undefined)} error={error} />
    </div>
  );
}

export const Default: Story = {
  args: { onChange: () => {} },
  render: () => <Demo />,
};

export const WithError: Story = {
  args: { onChange: () => {} },
  render: () => <Demo error="사고 발생일을 선택하세요." />,
};
