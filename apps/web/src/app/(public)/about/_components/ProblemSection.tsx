import type { ComponentType } from "react";
import { AlertTriangle } from "@/shared/ui/icons/AlertTriangle";
import { FileText } from "@/shared/ui/icons/FileText";
import { MessageCircle } from "@/shared/ui/icons/MessageCircle";
import { Scale } from "@/shared/ui/icons/Scale";
import { TrendingUp } from "@/shared/ui/icons/TrendingUp";
import { SectionHeading } from "../../_shared/_components/SectionHeading";
import { PROBLEM_ITEMS, type ProblemIconName } from "../_model/content";

const ICONS: Record<ProblemIconName, ComponentType<{ className?: string }>> = {
  fileText: FileText,
  alertTriangle: AlertTriangle,
  scale: Scale,
  trendingUp: TrendingUp,
  messageCircle: MessageCircle
};

export function ProblemSection() {
  return (
    <section className="mx-auto w-full max-w-[80rem] px-6 py-16 md:px-14 md:py-20">
      <SectionHeading kicker="왜 필요한가요" title="이런 부분은 놓치기 쉽습니다" />

      <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {PROBLEM_ITEMS.map((item) => {
          const Icon = ICONS[item.iconName];
          return (
            <li
              key={item.title}
              className="rounded-card border border-line bg-card p-7"
            >
              <span className="flex size-11 items-center justify-center rounded-[0.875rem] bg-gold-soft text-gold-ink">
                <Icon className="size-[1.375rem]" />
              </span>
              <h3 className="mt-[1.125rem] text-[1.0625rem] font-bold text-ink">{item.title}</h3>
              <p className="mt-2 break-keep text-[0.875rem] leading-[1.6] text-ink-2">{item.body}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
