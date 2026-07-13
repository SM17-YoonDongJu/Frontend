import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MatchRejectConfirmModal } from "./MatchRejectConfirmModal";

const meta = {
  title: "UI/Chat/MatchRejectConfirmModal",
  component: MatchRejectConfirmModal,
  parameters: { layout: "fullscreen" },
  args: {
    open: true,
    adjusterName: "김도현 손해사정사",
    onConfirm: () => {},
    onCancel: () => {},
  },
} satisfies Meta<typeof MatchRejectConfirmModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Pending: Story = { args: { pending: true } };
