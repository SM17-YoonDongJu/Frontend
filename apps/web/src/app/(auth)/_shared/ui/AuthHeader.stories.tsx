import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Link from "next/link";
import { AuthHeader } from "./AuthHeader";

const meta: Meta<typeof AuthHeader> = {
  title: "auth/AuthHeader",
  component: AuthHeader,
};

export default meta;
type Story = StoryObj<typeof AuthHeader>;

export const BrandOnly: Story = {};

export const WithLoginPrompt: Story = {
  args: {
    right: (
      <span className="flex items-center gap-2.5 text-[0.8125rem]">
        <span className="font-medium text-ink-3">이미 계정이 있으신가요?</span>
        <Link
          href="/login"
          className="rounded-button border border-line px-[0.9375rem] py-[0.5625rem] font-semibold text-ink transition hover:bg-paper"
        >
          로그인
        </Link>
      </span>
    ),
  },
};
