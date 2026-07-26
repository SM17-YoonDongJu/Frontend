import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Button } from "./Button";
import { ConfirmDialog, type ConfirmDialogProps } from "./ConfirmDialog";

const meta = {
  title: "ui/ConfirmDialog",
  component: ConfirmDialog,
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

type DemoProps = Omit<ConfirmDialogProps, "open" | "onConfirm" | "onCancel"> & {
  trigger: string;
};

function Demo({ trigger, ...dialogProps }: DemoProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>{trigger}</Button>
      <ConfirmDialog
        {...dialogProps}
        open={open}
        onConfirm={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}

const baseArgs = {
  open: false,
  title: "저장하지 않고 나갈까요?",
  confirmLabel: "확인",
  cancelLabel: "취소",
  onConfirm: () => {},
  onCancel: () => {},
} satisfies ConfirmDialogProps;

export const Default: Story = {
  args: baseArgs,
  render: () => (
    <Demo
      trigger="확인 다이얼로그 열기"
      title="저장하지 않고 나갈까요?"
      description="작성 중인 내용은 저장되지 않습니다."
      confirmLabel="나가기"
      cancelLabel="계속 작성"
    />
  ),
};

export const Danger: Story = {
  args: baseArgs,
  render: () => (
    <Demo
      trigger="탈퇴 확인 열기"
      title="정말 탈퇴하시겠어요?"
      description="탈퇴하면 제안·상담·리포트 이력이 모두 삭제되고 복구할 수 없습니다."
      confirmLabel="탈퇴하기"
      cancelLabel="취소"
      confirmTone="danger"
    />
  ),
};

export const NonDismissible: Story = {
  args: baseArgs,
  render: () => (
    <Demo
      trigger="강제 선택 다이얼로그 열기"
      title="검수 결과를 제출할까요?"
      description="제출 후에는 수정할 수 없습니다. 버튼으로만 닫을 수 있습니다."
      confirmLabel="제출하기"
      cancelLabel="다시 확인"
      dismissible={false}
    />
  ),
};
