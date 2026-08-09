import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./Button";

// 스토리용 샘플 아이콘 (소비처는 ReactNode를 넘긴다)
const ArrowRight = () => (
  <svg width="1.1em" height="1.1em" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: { layout: "centered" },
  args: { children: "버튼" },
  argTypes: {
    variant: { control: "select", options: ["primary", "gold", "outline", "ghost", "danger"] },
    size: { control: "select", options: ["sm", "md", "lg"] }
  }
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <Button variant="primary">1차 (Ink)</Button>
      <Button variant="gold">골드</Button>
      <Button variant="outline">아웃라인</Button>
      <Button variant="ghost">고스트</Button>
      <Button variant="danger">위험 · 삭제</Button>
    </div>
  )
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <Button size="sm" icon={<ArrowRight />}>Small</Button>
      <Button size="md" icon={<ArrowRight />}>Medium</Button>
      <Button size="lg" icon={<ArrowRight />}>Large</Button>
    </div>
  )
};

export const WithIcon: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <Button iconLeft={<ArrowRight />}>좌측 아이콘</Button>
      <Button icon={<ArrowRight />}>우측 아이콘</Button>
    </div>
  )
};

export const Loading: Story = {
  args: { loading: true, children: "전송 중…" }
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <Button disabled>비활성</Button>
      <Button variant="outline" disabled>비활성</Button>
    </div>
  )
};

export const FullWidth: Story = {
  args: { full: true, children: "가로 꽉" },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>]
};
