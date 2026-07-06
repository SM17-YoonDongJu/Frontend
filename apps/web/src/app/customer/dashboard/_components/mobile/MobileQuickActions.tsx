import Link from "next/link";
import type { ReactNode } from "react";
import { MessageCircle } from "@/shared/ui/icons/MessageCircle";
import { Upload } from "@/shared/ui/icons/Upload";
import { DASHBOARD_LINKS } from "@/app/customer/dashboard/_model/dashboard-links";

interface QuickAction {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    href: DASHBOARD_LINKS.newAnalysis,
    icon: <Upload className="text-[1.25rem]" />,
    title: "문서로 시작",
    description: "진단서·증권 업로드",
  },
  {
    href: DASHBOARD_LINKS.chat,
    icon: <MessageCircle className="text-[1.25rem]" />,
    title: "보상 상담",
    description: "궁금한 점 질문",
  },
];

export function MobileQuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {QUICK_ACTIONS.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className="rounded-card border border-line bg-card p-4 shadow-[0px_1px_1px_rgba(21,32,46,0.03)] transition hover:brightness-[.98]"
        >
          <span className="flex size-[2.375rem] items-center justify-center rounded-button bg-gold-soft text-gold-ink">
            {action.icon}
          </span>
          <p className="mt-3.5 text-sm font-bold text-ink">{action.title}</p>
          <p className="mt-1 text-[0.75rem] text-ink-3">{action.description}</p>
        </Link>
      ))}
    </div>
  );
}
