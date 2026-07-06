import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FileText } from "@/shared/ui/icons/FileText";
import { AccidentTypeCard } from "./AccidentTypeCard";

const meta: Meta<typeof AccidentTypeCard> = {
  title: "adjust-request/AccidentTypeCard",
  component: AccidentTypeCard,
  args: {
    icon: <FileText />,
    title: "실손 의료비",
    description: "치료비·통원 보상",
    selected: false,
    onSelect: () => {},
  },
  decorators: [
    (Story) => (
      <div className="w-[20rem]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AccidentTypeCard>;

export const Default: Story = {};
export const Selected: Story = { args: { selected: true } };
export const Disabled: Story = { args: { title: "교통사고", description: "자동차·이륜차 사고 보상", disabled: true } };
