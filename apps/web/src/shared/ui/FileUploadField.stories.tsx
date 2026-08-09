import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FileUploadField } from "./FileUploadField";

const meta = {
  title: "UI/FileUploadField",
  component: FileUploadField,
  parameters: { layout: "padded" },
  args: {
    label: "자격증 사본",
    description: "신체손해사정사 자격증 (PDF/이미지)",
    status: "idle",
    onSelectFile: () => {},
  },
} satisfies Meta<typeof FileUploadField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {};

export const Uploading: Story = {
  args: { status: "uploading" },
};

export const Done: Story = {
  args: { status: "done", fileName: "손해사정사_자격증.pdf · 1.2MB" },
};

export const Error: Story = {
  args: {
    status: "error",
    errorMessage: "파일당 최대 20MB까지 올릴 수 있어요.",
  },
};
