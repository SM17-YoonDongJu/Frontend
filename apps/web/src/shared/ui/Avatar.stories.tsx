import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Avatar } from "./Avatar";

const meta = {
  title: "UI/Avatar",
  component: Avatar,
  parameters: { layout: "centered" },
  args: { name: "김도현" },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Initial: Story = {};

export const Image: Story = {
  args: { src: "https://i.pravatar.cc/96" },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar name="김도현" size="sm" />
      <Avatar name="정우성" size="md" />
      <Avatar name="윤지후" size="lg" />
    </div>
  ),
};
