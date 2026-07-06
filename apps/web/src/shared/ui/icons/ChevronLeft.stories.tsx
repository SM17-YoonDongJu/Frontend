import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChevronLeft } from "./ChevronLeft";

const meta = {
  title: "UI/Icons/ChevronLeft",
  component: ChevronLeft,
  parameters: { layout: "centered" },
} satisfies Meta<typeof ChevronLeft>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <span className="text-2xl text-ink">
      <ChevronLeft />
    </span>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4 text-ink">
      <span className="text-base">
        <ChevronLeft />
      </span>
      <span className="text-xl">
        <ChevronLeft />
      </span>
      <span className="text-3xl text-ink-3">
        <ChevronLeft />
      </span>
    </div>
  ),
};
