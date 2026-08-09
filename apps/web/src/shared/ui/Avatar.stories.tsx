import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Avatar } from "./Avatar";

const meta = {
  title: "UI/Avatar",
  component: Avatar,
  parameters: { layout: "centered" },
  args: { name: "김도현" },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    tone: { control: "inline-radio", options: ["navy", "gold", "ink", "glass"] },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Initial: Story = {};

export const Image: Story = {
  args: { src: "https://i.pravatar.cc/96" },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar name="김도현" size="sm" />
      <Avatar name="정우성" size="md" />
      <Avatar name="윤지후" size="lg" />
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="flex items-center gap-4 rounded-card bg-navy-2 p-4">
      <Avatar name="김도현" tone="navy" />
      <Avatar name="정우성" tone="gold" />
      <Avatar name="윤지후" tone="ink" />
      <Avatar name="박서연" tone="glass" />
    </div>
  ),
};

/** 임의 크기: wrapper text-* 하나로 지름·이니셜이 함께 스케일 */
export const CustomSize: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar name="김도현" className="text-[2.125rem]" />
      <Avatar name="정우성" className="text-[3.25rem]" />
      <Avatar name="윤지후" className="text-[5.25rem]" />
    </div>
  ),
};

/** 반응형 크기: 브레이크포인트별 클래스 1개로 연동 (뷰포트 리사이즈로 확인) */
export const Responsive: Story = {
  args: { className: "text-[5.25rem] lg:text-[6rem]" },
};

/** label 지정 시 role="img"+aria-label로 스크린리더에 노출 */
export const WithLabel: Story = {
  args: { label: "김도현 프로필 이미지" },
};
