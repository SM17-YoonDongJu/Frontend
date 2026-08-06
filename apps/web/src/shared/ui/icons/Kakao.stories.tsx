import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Kakao } from "./Kakao";

const meta = {
  title: "UI/Icons/Kakao",
  component: Kakao,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Kakao>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Kakao className="size-6 text-kakao-ink" />,
};

export const OnBrandBadge: Story = {
  render: () => (
    <span className="flex size-9 items-center justify-center rounded-chip bg-kakao-ink text-kakao">
      <Kakao className="size-5" />
    </span>
  ),
};
