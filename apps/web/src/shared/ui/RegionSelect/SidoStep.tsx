"use client";

import { cn } from "@/shared/lib/utils";
import { SIDO_LIST, type Sido } from "@/shared/model/regions";
import { ChevronRight } from "@/shared/ui/icons/ChevronRight";
import { ROW } from "./row-style";

export function SidoStep({ onEnter }: { onEnter: (sido: Sido) => void }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col border-t border-line-2">
      <p className="px-4 py-2.5 text-xs font-bold text-ink-3">시·도 선택</p>
      <ul className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
        {SIDO_LIST.map((sido) => (
          <li key={sido.name}>
            <button type="button" onClick={() => onEnter(sido)} className={cn(ROW, "hover:bg-paper")}>
              <span className="flex-1 text-left font-medium text-ink-2">{sido.name}</span>
              {sido.districts.length > 0 && (
                <span className="text-xs text-ink-3">{sido.districts.length}</span>
              )}
              <ChevronRight className="shrink-0 text-base text-ink-3" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
