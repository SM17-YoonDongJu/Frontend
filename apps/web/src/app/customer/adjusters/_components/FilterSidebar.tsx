"use client";

import { cn } from "@/shared/lib/utils";
import { ShieldCheck } from "@/shared/ui/icons/ShieldCheck";
import { SPECIALTY_OPTIONS } from "../_model/filter-options";
import type { AdjusterListItem } from "../_model/types";

interface FilterSidebarProps {
  specialty: string;
  list: AdjusterListItem[];
  onSpecialtyChange: (specialty: string) => void;
}

const ALL_SPECIALTY = "전체";

function countBySpecialty(list: AdjusterListItem[], specialty: string): number {
  if (specialty === ALL_SPECIALTY) return list.length;
  return list.filter((item) => item.specialties.includes(specialty)).length;
}

export function FilterSidebar({ specialty, list, onSpecialtyChange }: FilterSidebarProps) {
  const activeSpecialty = specialty || ALL_SPECIALTY;

  return (
    <aside className="hidden w-62 shrink-0 space-y-4 md:block">
      <section className="rounded-card border border-line bg-card p-5">
        <h2 className="text-sm font-semibold text-ink">전문 분야</h2>
        <ul className="mt-3 space-y-0.5">
          {SPECIALTY_OPTIONS.map((option) => {
            const selected = option === activeSpecialty;
            return (
              <li key={option}>
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onSpecialtyChange(option)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-chip px-3 py-2 text-sm transition",
                    selected ? "bg-ink text-white" : "text-ink-2 hover:bg-paper",
                  )}
                >
                  <span>{option}</span>
                  <span className={cn("text-xs", selected ? "text-white/70" : "text-ink-3")}>
                    {countBySpecialty(list, option)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <p className="flex items-start gap-2 rounded-card bg-green-soft px-4 py-3.5 text-[0.8125rem] leading-relaxed text-green">
        <ShieldCheck className="mt-0.5 shrink-0 text-base" />
        모든 사정사는 금감원 등록번호와 신원이 검증되었습니다.
      </p>
    </aside>
  );
}
