import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ToggleChip } from "./ToggleChip";

const meta = {
  title: "adjust-request/ToggleChip",
  component: ToggleChip,
  args: { label: "통원", selected: false, onClick: () => {} },
} satisfies Meta<typeof ToggleChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = { args: { selected: true } };
