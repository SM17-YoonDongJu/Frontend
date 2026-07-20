import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Toast } from "./Toast";

const meta: Meta<typeof Toast> = {
  title: "UI/Toast",
  component: Toast,
  parameters: { layout: "centered" },
  args: {
    variant: "success",
    message: "제안을 채택했어요.",
    onClose: () => {},
  },
  argTypes: {
    variant: { control: "select", options: ["success", "error"] },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Success: Story = {};

export const Error: Story = {
  args: {
    variant: "error",
    message: "제안 채택에 실패했어요. 잠시 후 다시 시도해 주세요.",
  },
};

export const LongMessage: Story = {
  args: {
    variant: "error",
    message:
      "요청을 처리하지 못했어요. 네트워크 상태를 확인한 뒤 잠시 후 다시 시도해 주세요. 문제가 계속되면 고객센터로 문의해 주세요.",
  },
};

export const Stack: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 360 }}>
      <Toast variant="success" message="제안을 채택했어요." onClose={() => {}} />
      <Toast variant="success" message="내 정보를 저장했어요." onClose={() => {}} />
      <Toast
        variant="error"
        message="제안 채택에 실패했어요. 잠시 후 다시 시도해 주세요."
        onClose={() => {}}
      />
    </div>
  ),
};
