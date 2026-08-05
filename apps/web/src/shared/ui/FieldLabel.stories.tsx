import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FieldLabel } from "./FieldLabel";
import { Input } from "./Input";

const meta: Meta<typeof FieldLabel> = {
  title: "UI/FieldLabel",
  component: FieldLabel,
  parameters: { layout: "padded" }
};

export default meta;
type Story = StoryObj<typeof FieldLabel>;

export const Default: Story = {
  args: { children: "치료 형태" }
};

export const WithCounter: Story = {
  args: { children: "한 줄 소개", counter: "12/40" }
};

// htmlFor를 주면 label 요소로 렌더해 인풋과 연결된다
export const WithInput: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <FieldLabel htmlFor="contact-title">문의 제목</FieldLabel>
      <Input id="contact-title" placeholder="예) 분석 결과 문의" />
    </div>
  )
};
