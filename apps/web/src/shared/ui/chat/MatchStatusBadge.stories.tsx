import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MatchStatusBadge } from "./MatchStatusBadge";

const meta: Meta<typeof MatchStatusBadge> = {
  title: "UI/Chat/MatchStatusBadge",
  component: MatchStatusBadge,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof MatchStatusBadge>;

export const Matched: Story = { args: { group: "matched" } };

export const Ended: Story = { args: { group: "ended" } };

/** 비교중은 배지를 렌더하지 않아 빈 화면이 정상. */
export const Comparing: Story = { args: { group: "comparing" } };
