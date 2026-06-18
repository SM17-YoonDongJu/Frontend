import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AmountRange } from "./AmountRange";

const meta = {
  title: "UI/AmountRange",
  component: AmountRange,
  parameters: { layout: "centered" },
  args: { min: 13_500_000, max: 17_000_000, size: "lg" },
  argTypes: {
    size: { control: "select", options: ["md", "lg"] },
  },
} satisfies Meta<typeof AmountRange>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Range: Story = {
  args: { min: 13_500_000, max: 17_000_000, size: "lg" },
};

export const Single: Story = {
  args: { min: 8_500_000, max: null, size: "md" },
};
