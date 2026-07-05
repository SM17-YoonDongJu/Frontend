import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChatThreadHeader } from "./ChatThreadHeader";

const meta = {
  title: "UI/Chat/ChatThreadHeader",
  component: ChatThreadHeader,
  parameters: { layout: "fullscreen" },
  args: {
    name: "김도현 손해사정사",
    caseNo: "#20260520-017",
    roomStatus: "ACTIVE",
    reportHref: "#",
  },
} satisfies Meta<typeof ChatThreadHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithBack: Story = { args: { onBack: () => {} } };

export const Closed: Story = {
  args: { name: "윤지후 손해사정사", roomStatus: "CLOSED", caseNo: "#20260428-003" },
};
