import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Apple } from "./Apple";

const meta = {
  title: "UI/Icons/Apple",
  component: Apple,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Apple>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Apple className="size-6 text-apple" />,
};

export const OnBrandBadge: Story = {
  render: () => (
    <span className="flex size-9 items-center justify-center rounded-chip bg-apple text-white">
      <Apple className="size-5" />
    </span>
  ),
};
