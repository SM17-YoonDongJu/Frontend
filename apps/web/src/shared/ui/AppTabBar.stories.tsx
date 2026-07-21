import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Decorator, Meta, StoryObj } from "@storybook/nextjs-vite";
import { userKeys } from "@/shared/api/query-keys";
import type { Me } from "@/shared/model/user";
import { AppTabBar } from "./AppTabBar";

const CUSTOMER_ME: Me = {
  userId: "user-1",
  nickname: "김보험",
  email: "customer@example.com",
  userType: "insured_person",
  createdAt: "2026-01-01T00:00:00.000Z",
  phoneNumber: null,
  gender: null,
  avatarUrl: null,
  role: "USER",
  socialProvider: "kakao",
  region: []
};

const ADJUSTER_ME: Me = {
  ...CUSTOMER_ME,
  nickname: "박사정",
  userType: "adjuster",
  role: "CERTIFICATED_ADJUSTER"
};

/** useAuthStatus 쿼리에 인증 사용자를 미리 심어 탭바가 노출되도록 감싼다. */
function authenticatedAs(me: Me): Decorator {
  return (Story) => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false, staleTime: Infinity } }
    });
    queryClient.setQueryData(userKeys.me.queryKey, me);
    return (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    );
  };
}

const meta = {
  title: "UI/AppTabBar",
  component: AppTabBar,
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true }
  },
  globals: { viewport: { value: "mobile1" } }
} satisfies Meta<typeof AppTabBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 고객 홈 — 홈 탭 활성. */
export const Customer: Story = {
  args: { variant: "customer" },
  decorators: [authenticatedAs(CUSTOMER_ME)],
  parameters: { nextjs: { appDirectory: true, navigation: { pathname: "/customer/dashboard" } } }
};

/** 고객 리포트 탭 활성. */
export const CustomerReportActive: Story = {
  args: { variant: "customer" },
  decorators: [authenticatedAs(CUSTOMER_ME)],
  parameters: { nextjs: { appDirectory: true, navigation: { pathname: "/customer/proposals" } } }
};

/** 사정사 홈 — 홈 탭 활성. */
export const Partner: Story = {
  args: { variant: "partner" },
  decorators: [authenticatedAs(ADJUSTER_ME)],
  parameters: { nextjs: { appDirectory: true, navigation: { pathname: "/partner" } } }
};

/** 탭 href가 아닌 상세 경로 — default-hide로 탭바 미노출(빈 화면). */
export const HiddenOnDetailRoute: Story = {
  args: { variant: "customer" },
  decorators: [authenticatedAs(CUSTOMER_ME)],
  parameters: {
    nextjs: { appDirectory: true, navigation: { pathname: "/customer/report/abc123" } }
  }
};
