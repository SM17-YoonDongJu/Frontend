import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Popover } from "./Popover";

const meta: Meta<typeof Popover> = {
  title: "shared/Popover",
  component: Popover,
};

export default meta;
type Story = StoryObj<typeof Popover>;

function PopoverDemo() {
  const [open, setOpen] = useState(true);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="flex h-80 justify-end p-4">
      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-button border border-line bg-paper px-4 py-2 text-[0.8125rem] font-semibold text-ink transition hover:brightness-[.96]"
        >
          팝오버 열기
        </button>
        <Popover
          open={open}
          onClose={() => setOpen(false)}
          triggerRef={triggerRef}
          label="예시 팝오버"
          className="w-72 p-5"
        >
          <p className="text-[0.8125rem] font-bold text-ink">팝오버 제목</p>
          <p className="mt-1 text-[0.75rem] text-ink-2">
            Esc 또는 바깥 클릭으로 닫힙니다.
          </p>
        </Popover>
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => <PopoverDemo />,
};
