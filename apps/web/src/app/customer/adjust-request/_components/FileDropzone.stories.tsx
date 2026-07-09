import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FileDropzone } from "./FileDropzone";

const meta: Meta<typeof FileDropzone> = {
  title: "adjust-request/FileDropzone",
  component: FileDropzone,
  args: { accept: ".pdf,.jpg,.jpeg,.png", onFiles: () => {} },
  decorators: [
    (Story) => (
      <div className="w-[32.5rem]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FileDropzone>;

export const Default: Story = {};
