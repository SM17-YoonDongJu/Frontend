import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Button } from "./Button";
import { Modal } from "./Modal";

const meta = {
  title: "ui/Modal",
  component: Modal,
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo({ dismissible, kicker }: { dismissible?: boolean; kicker?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>모달 열기</Button>
      <Modal
        open={open}
        title="알림 설정"
        kicker={kicker}
        dismissible={dismissible}
        onClose={() => setOpen(false)}
      >
        <p className="text-sm leading-relaxed text-ink-2">
          받고 싶은 알림을 선택해 주세요. 변경 내용은 저장을 눌러야 반영됩니다.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
            취소
          </Button>
          <Button size="sm" onClick={() => setOpen(false)}>
            저장하기
          </Button>
        </div>
      </Modal>
    </>
  );
}

export const Default: Story = {
  args: { open: false, title: "알림 설정", onClose: () => {}, children: null },
  render: () => <Demo />,
};

export const NonDismissible: Story = {
  args: { open: false, title: "알림 설정", onClose: () => {}, children: null },
  render: () => <Demo dismissible={false} />,
};

export const WithKicker: Story = {
  args: { open: false, title: "알림 설정", onClose: () => {}, children: null },
  render: () => <Demo kicker="내 정보" />,
};
