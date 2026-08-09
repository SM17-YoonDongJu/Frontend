import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RegionSelectTrigger } from "./RegionSelectTrigger";

const meta = {
  title: "ui/RegionSelect/Trigger",
  component: RegionSelectTrigger,
  args: {
    open: false,
    onToggle: () => {},
    onClear: () => {},
  },
} satisfies Meta<typeof RegionSelectTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: { label: null },
};

export const Selected: Story = {
  args: { label: "서울 강남구" },
};

export const SelectedWholeSido: Story = {
  args: { label: "서울 전체" },
};
