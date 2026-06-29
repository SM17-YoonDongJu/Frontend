import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PreviewCard } from "./PreviewCard";

const meta: Meta<typeof PreviewCard> = {
  title: "profile-edit/PreviewCard",
  component: PreviewCard,
  args: {
    nickname: "김도현",
    headline: "후유장해 재산정 전문 · 근거 중심 검토",
    specialties: ["후유장해", "교통사고"],
    career: 12,
    activityRegion: "서울 · 경기",
    avatarUrl: null,
  },
  decorators: [
    (Story) => (
      <div className="w-[21.25rem]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PreviewCard>;

export const Default: Story = {};

export const Empty: Story = {
  args: { headline: "", specialties: [], career: 0, activityRegion: "" },
};

export const NoSpecialties: Story = {
  args: { specialties: [] },
};
