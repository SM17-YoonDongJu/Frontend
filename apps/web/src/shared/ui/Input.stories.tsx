import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  parameters: { layout: "padded" },
  decorators: [(Story) => <div style={{ maxWidth: 360 }}><Story /></div>]
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Text: Story = {
  args: { placeholder: "예) 경추 염좌, 요추 추간판탈출" }
};

export const WithHint: Story = {
  args: { placeholder: "예) 20", suffix: "%", hint: "모르면 비워두셔도 됩니다." }
};

export const WithError: Story = {
  args: { placeholder: "제0000호", error: "등록번호 형식이 올바르지 않아요." }
};

export const SuffixNode: Story = {
  args: {
    placeholder: "010-0000-0000",
    suffix: (
      <button type="button" className="rounded-button bg-ink px-3 py-1.5 text-[0.8125rem] font-semibold text-white">
        인증요청
      </button>
    )
  }
};

export const Select: Story = {
  args: {
    type: "select",
    defaultValue: "후유장해",
    children: (
      <>
        <option>후유장해</option>
        <option>진단비</option>
        <option>입원일당</option>
      </>
    )
  }
};

export const Textarea: Story = {
  args: { multiline: true, rows: 4, placeholder: "상해 경위를 적어주세요." }
};

export const Disabled: Story = {
  args: { placeholder: "비활성", disabled: true }
};
