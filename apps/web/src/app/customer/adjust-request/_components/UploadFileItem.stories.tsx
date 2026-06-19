import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { UploadFileItem } from "./UploadFileItem";

const meta: Meta<typeof UploadFileItem> = {
  title: "adjust-request/UploadFileItem",
  component: UploadFileItem,
  args: {
    name: "진단서.pdf",
    size: 2.4 * 1024 * 1024,
    status: "done",
    onRetry: () => {},
    onRemove: () => {},
  },
  decorators: [
    (Story) => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof UploadFileItem>;

export const Uploading: Story = { args: { status: "uploading", name: "보험증권.pdf" } };
export const Done: Story = {};
export const Error: Story = {
  args: { status: "error", name: "지급결과서.jpg", errorMessage: "업로드 처리 중 오류가 발생했습니다." },
};
