import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { User } from "@/shared/ui/icons/User";
import { Scale } from "@/shared/ui/icons/Scale";
import { RoleCard } from "./RoleCard";

const meta: Meta<typeof RoleCard> = {
  title: "signup/RoleCard",
  component: RoleCard,
  args: {
    icon: <User />,
    title: "일반 사용자",
    description: "받은 보험금이 적정한지 분석받고 싶어요",
    hint: "바로 시작할 수 있어요",
    selected: false,
    onSelect: () => {},
  },
  decorators: [
    (Story) => (
      <div className="max-w-[30rem]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof RoleCard>;

export const InsuredSelected: Story = { args: { selected: true } };

export const AdjusterUnselected: Story = {
  args: {
    icon: <Scale />,
    title: "손해사정사",
    description: "사건을 검수하고 의뢰인과 상담하고 싶어요",
    hint: "자격 인증 후 활동할 수 있어요",
    badge: "자격 인증 필요",
  },
};
