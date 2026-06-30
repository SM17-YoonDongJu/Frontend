import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StarRating } from "./StarRating";

const meta = {
  title: "UI/StarRating",
  component: StarRating,
  parameters: { layout: "centered" },
  args: { score: 4 },
  argTypes: {
    score: { control: { type: "range", min: 0, max: 5, step: 1 } },
    size: { control: { type: "number" } },
  },
} satisfies Meta<typeof StarRating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Scores: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <StarRating score={5} />
      <StarRating score={4} />
      <StarRating score={3} />
      <StarRating score={0} />
    </div>
  ),
};

export const Large: Story = {
  args: { score: 5, size: 1.25 },
};
