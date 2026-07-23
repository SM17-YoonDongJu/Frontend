import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Tooltip } from "./Tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "UI/Tooltip",
  component: Tooltip,
  args: { label: "추후에 지원 예정입니다." },
  decorators: [
    (Story) => (
      <div className="flex justify-center p-20">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    children: (
      <button
        type="button"
        className="rounded-button border border-line bg-card px-4 py-2 text-[0.875rem] text-ink-2"
      >
        마우스를 올려보세요
      </button>
    ),
  },
};

/** disabled 트리거 위에서도 래퍼가 이벤트를 받아 말풍선이 뜬다. */
export const OnDisabledTrigger: Story = {
  args: {
    children: (
      <button
        type="button"
        disabled
        className="cursor-not-allowed rounded-button border border-line bg-card px-4 py-2 text-[0.875rem] text-ink-3 opacity-[.45]"
      >
        잠긴 버튼
      </button>
    ),
  },
};
