import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RefreshCw } from "./RefreshCw";

const meta = {
  title: "UI/Icons/RefreshCw",
  component: RefreshCw,
  parameters: { layout: "centered" },
} satisfies Meta<typeof RefreshCw>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <span className="text-2xl text-ink">
      <RefreshCw />
    </span>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4 text-ink">
      <span className="text-base">
        <RefreshCw />
      </span>
      <span className="text-xl">
        <RefreshCw />
      </span>
      <span className="text-3xl text-ink-3">
        <RefreshCw />
      </span>
    </div>
  ),
};
