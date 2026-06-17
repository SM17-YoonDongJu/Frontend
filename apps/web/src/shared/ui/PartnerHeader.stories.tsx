import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PartnerHeader } from "./PartnerHeader";

const meta = {
  title: "UI/PartnerHeader",
  component: PartnerHeader,
  parameters: { layout: "fullscreen" }
} satisfies Meta<typeof PartnerHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Mobile: Story = {
  globals: { viewport: { value: "mobile1" } }
};
