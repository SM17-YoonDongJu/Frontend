import type { ActivitySummary } from "./types";

/**
 * PC 사이드바 메뉴 config. 아이콘은 소비처(MypageSidebar)에서 key로 해석.
 * count는 활동 카운트에서 파생, emphasis=받은 제안(신규 강조).
 * CONTRACT(리더 확인, 이슈 #105): reports·consult 전용 목적지 라우트 미확정 — 잠정 매핑(대시보드).
 */
export interface MypageSidebarLink {
  key: "dashboard" | "reports" | "proposals" | "consult";
  label: string;
  href: string;
  countField?: keyof ActivitySummary;
  emphasis?: boolean;
}

export const MYPAGE_SIDEBAR_LINKS: MypageSidebarLink[] = [
  { key: "dashboard", label: "대시보드", href: "/customer/dashboard" },
  {
    key: "reports",
    label: "내 분석 리포트",
    href: "/customer/dashboard",
    countField: "reportCount",
  },
  {
    key: "proposals",
    label: "받은 제안",
    href: "/customer/proposals",
    countField: "proposalCount",
    emphasis: true,
  },
  { key: "consult", label: "상담 내역", href: "/customer/chat" },
];
