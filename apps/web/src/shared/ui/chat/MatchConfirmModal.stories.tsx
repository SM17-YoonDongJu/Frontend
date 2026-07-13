import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MatchConfirmModal } from "./MatchConfirmModal";

const meta: Meta<typeof MatchConfirmModal> = {
  title: "UI/Chat/MatchConfirmModal",
  component: MatchConfirmModal,
  parameters: { layout: "fullscreen" },
  args: {
    open: true,
    adjusterName: "김도현",
    endingConsultations: [{ name: "정우성 손해사정사" }, { name: "윤지후 손해사정사" }],
    onConfirm: () => {},
    onCancel: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof MatchConfirmModal>;

export const Default: Story = {};

/** 함께 종료되는 상담이 없을 때(비교 상대 1명). */
export const NoEndingConsultations: Story = { args: { endingConsultations: [] } };

export const Pending: Story = { args: { pending: true } };
