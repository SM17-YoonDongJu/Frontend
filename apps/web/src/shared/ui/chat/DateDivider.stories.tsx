import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DateDivider } from "./DateDivider";

const meta = {
  title: "UI/Chat/DateDivider",
  component: DateDivider,
  parameters: { layout: "padded" },
  args: { label: "2026.05.21" },
} satisfies Meta<typeof DateDivider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
