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

function Demo({
  initial = null,
  error,
  alwaysSheet,
}: {
  initial?: RegionValue | null;
  error?: string;
  alwaysSheet?: boolean;
}) {
  const [value, setValue] = useState<RegionValue | null>(initial);
  return (
    <div className="p-6">
      <RegionSelect
        value={value}
        onChange={setValue}
        error={value ? undefined : error}
        alwaysSheet={alwaysSheet}
      />
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

function MultipleDemo() {
  const [value, setValue] = useState<RegionValue[]>([
    { sido: "대구광역시", district: "남구" },
    { sido: "대구광역시", district: "달서구" },
  ]);
  return (
    <div className="p-6">
      <RegionSelect mode="multiple" value={value} onChange={setValue} />
      <p className="mt-80 text-sm text-ink-3">여러 지역을 함께 고를 수 있습니다.</p>
    </div>
  );
}

export const Multiple: Story = {
  args: { value: null, onChange: () => {} },
  render: () => <MultipleDemo />,
};

export const WithError: Story = {
  args: { value: null, onChange: () => {} },
  render: () => <Demo error="활동 지역을 선택해 주세요." />,
};

/** 모달·바텀시트 안에서 쓰는 형태 — PC에서도 팝오버 대신 시트로 연다. */
export const AlwaysSheet: Story = {
  args: { value: null, onChange: () => {} },
  render: () => <Demo alwaysSheet />,
};
