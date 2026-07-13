import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChatComparisonBanner } from "./ChatComparisonBanner";

const meta: Meta<typeof ChatComparisonBanner> = {
  title: "UI/Chat/ChatComparisonBanner",
  component: ChatComparisonBanner,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 680, border: "1px solid #e6e0d4", borderRadius: 16, overflow: "hidden" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ChatComparisonBanner>;

export const Comparing: Story = {
  args: { variant: "comparing", reportTypeLabel: "후유장해", comparingCount: 3 },
};

export const Matched: Story = {
  args: { variant: "matched", reportTypeLabel: "후유장해", progressHref: "#" },
};
