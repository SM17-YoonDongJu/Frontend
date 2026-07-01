import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useForm } from "react-hook-form";
import type { ProfileFormValues } from "../_model/types";
import { CareerItemForm } from "./CareerItemForm";

function Harness(props: { error?: { period?: string; company?: string } }) {
  const { register } = useForm<ProfileFormValues>({
    defaultValues: { careers: [{ period: "2019 ~ 현재", company: "독립 손해사정 법인 · 대표 사정사" }] },
  });
  return (
    <CareerItemForm index={0} register={register} error={props.error} onRemove={() => {}} />
  );
}

const meta: Meta<typeof Harness> = {
  title: "profile-edit/CareerItemForm",
  component: Harness,
  decorators: [
    (Story) => (
      <div className="w-[40rem]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Harness>;

export const Default: Story = {};

export const WithError: Story = {
  args: { error: { period: "기간을 입력해 주세요.", company: "내용을 입력해 주세요." } },
};
