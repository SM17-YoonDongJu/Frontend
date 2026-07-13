import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import type { RegionValue } from "@/shared/model/regions";
import { RegionSelect } from "./RegionSelect";

const meta = {
  title: "ui/RegionSelect",
  component: RegionSelect,
} satisfies Meta<typeof RegionSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo({ initial = null }: { initial?: RegionValue | null }) {
  const [value, setValue] = useState<RegionValue | null>(initial);
  return (
    <div className="p-6">
      <RegionSelect value={value} onChange={setValue} />
      <p className="mt-80 text-sm text-ink-3">바깥 영역 · Esc로 닫힙니다.</p>
    </div>
  );
}

export const Default: Story = {
  args: { value: null, onChange: () => {} },
  render: () => <Demo />,
};

export const Selected: Story = {
  args: { value: null, onChange: () => {} },
  render: () => <Demo initial={{ sido: "서울특별시", district: "강남구" }} />,
};
