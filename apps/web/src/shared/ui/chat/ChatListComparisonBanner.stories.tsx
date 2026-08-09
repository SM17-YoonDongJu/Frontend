import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChatListComparisonBanner } from "./ChatListComparisonBanner";

const meta: Meta<typeof ChatListComparisonBanner> = {
  title: "UI/Chat/ChatListComparisonBanner",
  component: ChatListComparisonBanner,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 402, background: "#fbf9f4" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ChatListComparisonBanner>;

export const Default: Story = {
  args: { reportTypeLabel: "후유장해", comparingCount: 3 },
};
