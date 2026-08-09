import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AvatarUploader } from "./AvatarUploader";

const queryClient = new QueryClient();

function Harness(props: { initial?: string | null }) {
  const [value, setValue] = useState<string | null>(props.initial ?? null);
  return <AvatarUploader value={value} nickname="김도현" onChange={setValue} />;
}

const meta: Meta<typeof Harness> = {
  title: "profile-edit/AvatarUploader",
  component: Harness,
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <div className="w-[24rem]">
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Harness>;

export const Empty: Story = {};

export const WithImage: Story = {
  args: { initial: "https://placehold.co/96x96" },
};
