import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { ReportChatDialog } from "./ReportChatDialog";

const meta = {
  title: "UI/Chat/ReportChatDialog",
  component: ReportChatDialog,
  parameters: { layout: "fullscreen" },
  args: {
    open: true,
    counterpartName: "김도현 손해사정사",
    onSubmit: () => {},
    onClose: () => {},
  },
} satisfies Meta<typeof ReportChatDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 — 사유 미선택이라 제출 버튼 비활성. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: "신고하기" })).toBeDisabled();
  },
};

/** 사유 선택됨 — 골드 선택 스타일 + 제출 버튼 활성. */
export const ReasonSelected: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("radio", { name: "욕설·비방·괴롭힘" }));
    await expect(canvas.getByRole("button", { name: "신고하기" })).toBeEnabled();
  },
};

/** 기타 선택 — 상세 사유가 필수라 공백이면 제출 비활성. */
export const OtherReasonRequiresDetail: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("radio", { name: "기타" }));
    await expect(canvas.getByRole("button", { name: "신고하기" })).toBeDisabled();
  },
};

/** 제출 중 — 라벨 `접수 중...`, 입력·닫기 차단. */
export const Pending: Story = { args: { pending: true } };

/** 실패 — 인라인 에러 유지 + 입력값 보존. */
export const WithError: Story = {
  args: { errorMessage: "신고 접수에 실패했어요. 잠시 후 다시 시도해 주세요." },
};
