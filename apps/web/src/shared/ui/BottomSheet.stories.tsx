import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { BottomSheet } from "./BottomSheet";
import { Button } from "./Button";

const meta = {
  title: "ui/BottomSheet",
  component: BottomSheet,
} satisfies Meta<typeof BottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo({ kicker }: { kicker?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>바텀시트 열기</Button>
      <BottomSheet
        open={open}
        title="프로필 설정"
        kicker={kicker}
        onClose={() => setOpen(false)}
      >
        <p className="text-sm leading-relaxed text-ink-2">
          휴대폰·이메일은 리포트·제안 알림 수신에 사용돼요.
        </p>
        <Button full className="mt-6" onClick={() => setOpen(false)}>
          저장하기
        </Button>
      </BottomSheet>
    </>
  );
}

export const Default: Story = {
  args: { open: false, title: "프로필 설정", onClose: () => {}, children: null },
  render: () => <Demo />,
};

export const WithKicker: Story = {
  args: { open: false, title: "프로필 설정", onClose: () => {}, children: null },
  render: () => <Demo kicker="마이페이지" />,
};
