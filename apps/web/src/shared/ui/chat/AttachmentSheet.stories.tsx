import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AttachmentSheet } from "./AttachmentSheet";

const meta = {
  title: "UI/Chat/AttachmentSheet",
  component: AttachmentSheet,
  parameters: { layout: "fullscreen" },
  args: { open: true, onPick: () => {}, onClose: () => {} },
} satisfies Meta<typeof AttachmentSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
