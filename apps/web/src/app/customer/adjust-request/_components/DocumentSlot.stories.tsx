import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DOCUMENT_SLOTS } from "../_model/document-slots";
import { DocumentSlot } from "./DocumentSlot";

const [diagnosis, , payoutResult] = DOCUMENT_SLOTS;

const meta: Meta<typeof DocumentSlot> = {
  title: "adjust-request/DocumentSlot",
  component: DocumentSlot,
  args: {
    def: diagnosis,
    status: "idle",
    accept: ".pdf,.jpg,.jpeg,.png",
    onPickFile: () => {},
    onRetry: () => {},
    onRemove: () => {},
  },
  decorators: [
    (Story) => (
      <div className="w-[26.25rem]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DocumentSlot>;

export const IdleRequired: Story = {};
export const IdleOptionalWithHint: Story = { args: { def: payoutResult } };
export const Uploading: Story = { args: { status: "uploading", fileName: "진단서.pdf" } };
export const Done: Story = { args: { status: "done", fileName: "진단서.pdf" } };
export const Error: Story = {
  args: { status: "error", errorMessage: "업로드 처리 중 오류가 발생했습니다." },
};
