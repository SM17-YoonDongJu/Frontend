import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Decorator, Meta, StoryObj } from "@storybook/nextjs-vite";
import { AsyncBoundary } from "./AsyncBoundary";

const withQueryClient: Decorator = (Story) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <Story />
    </QueryClientProvider>
  );
};

function Loaded() {
  return <div className="rounded-card border border-line bg-card px-6 py-10">불러온 내용</div>;
}

function Suspending(): never {
  throw new Promise<void>(() => {});
}

function Failing(): never {
  throw Object.assign(new Error("불러오기 실패"), { name: "INTERNAL_SERVER_ERROR" });
}

const Skeleton = <div className="rounded-card border border-line bg-card px-6 py-10">로딩 중…</div>;

const meta = {
  title: "UI/AsyncBoundary",
  component: AsyncBoundary,
  parameters: { layout: "padded" },
  decorators: [withQueryClient],
  args: {
    fallback: Skeleton,
    errorLayout: "card",
  },
} satisfies Meta<typeof AsyncBoundary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: { children: <Loaded /> },
};

export const Loading: Story = {
  args: { children: <Suspending /> },
};

export const Failure: Story = {
  args: { children: <Failing />, errorTitle: "정보를 불러오지 못했어요" },
};
