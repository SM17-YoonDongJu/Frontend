import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Search } from "./Search";

const meta = {
  title: "UI/Icons/Search",
  component: Search,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Search>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <span className="text-2xl text-ink">
      <Search />
    </span>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4 text-ink">
      <span className="text-base">
        <Search />
      </span>
      <span className="text-xl">
        <Search />
      </span>
      <span className="text-3xl text-ink-3">
        <Search />
      </span>
    </div>
  ),
};
