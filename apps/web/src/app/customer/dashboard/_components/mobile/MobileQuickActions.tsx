import Link from "next/link";
import type { ReactNode } from "react";
import { FileText } from "@/shared/ui/icons/FileText";
import { Plus } from "@/shared/ui/icons/Plus";
import { Search } from "@/shared/ui/icons/Search";
import { DASHBOARD_LINKS } from "@/app/customer/dashboard/_model/dashboard-links";

interface QuickAction {
  href: string;
  icon: ReactNode;
  label: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    href: DASHBOARD_LINKS.newAnalysis,
    icon: <Plus className="text-[1rem]" />,
    label: "새 분석",
  },
  {
    href: DASHBOARD_LINKS.allReports,
    icon: <FileText className="text-[1rem]" />,
    label: "내 리포트",
  },
  {
    href: DASHBOARD_LINKS.adjusterFinder,
    icon: <Search className="text-[1rem]" />,
    label: "사정사 찾기",
  },
];

export function MobileQuickActions() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {QUICK_ACTIONS.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className="flex flex-col items-center rounded-input border border-line bg-card px-[0.3125rem] py-[0.8125rem] transition hover:brightness-[.98]"
        >
          <span className="flex size-[2.125rem] items-center justify-center rounded-chip bg-gold-soft text-gold-ink">
            {action.icon}
          </span>
          <span className="mt-[0.4375rem] text-[0.6875rem] font-semibold text-ink-2">
            {action.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
