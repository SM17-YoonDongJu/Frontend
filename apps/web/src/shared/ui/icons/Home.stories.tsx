import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Home } from "./Home";

const meta = {
  title: "UI/Icons/Home",
  component: Home,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Home>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <span className="text-2xl text-ink">
      <Home />
    </span>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4 text-ink">
      <span className="text-base">
        <Home />
      </span>
      <span className="text-xl">
        <Home />
      </span>
      <span className="text-3xl text-ink-3">
        <Home />
      </span>
    </div>
  ),
};
