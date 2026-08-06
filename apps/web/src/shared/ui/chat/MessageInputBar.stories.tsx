import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MessageInputBar } from "./MessageInputBar";

const meta = {
  title: "UI/Chat/MessageInputBar",
  component: MessageInputBar,
  parameters: { layout: "fullscreen" },
  args: { onSend: () => {} },
} satisfies Meta<typeof MessageInputBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };

export const Closed: Story = { args: { closed: true } };

export const SendFailed: Story = { args: { sendFailed: true } };

export const WithAttachButton: Story = { args: { onPickFile: () => {} } };
