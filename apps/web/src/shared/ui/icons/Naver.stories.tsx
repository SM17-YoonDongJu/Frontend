import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Naver } from "./Naver";

const meta = {
  title: "UI/Icons/Naver",
  component: Naver,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Naver>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Naver className="size-6 text-naver" />,
};

export const OnBrandBadge: Story = {
  render: () => (
    <span className="flex size-9 items-center justify-center rounded-chip bg-white text-naver">
      <Naver className="size-4" />
    </span>
  ),
};
