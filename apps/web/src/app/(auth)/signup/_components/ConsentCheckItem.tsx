import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { Check } from "@/shared/ui/icons/Check";
import { ChevronRight } from "@/shared/ui/icons/ChevronRight";
import type { ConsentItem } from "../_model/consent-config";

interface ConsentCheckItemProps {
  item: ConsentItem;
  checked: boolean;
  onToggle: (checked: boolean) => void;
  /** 상세 페이지 링크(terms/[type]) */
  detailHref: string;
}

/** 약관 1행: 체크박스 + "(필수)/(선택)" 라벨 + 상세보기 링크. */
export function ConsentCheckItem({ item, checked, onToggle, detailHref }: ConsentCheckItemProps) {
  const prefix = item.required ? "(필수)" : "(선택)";
  const boxId = `consent-${item.type}`;

  return (
    <div className="flex items-center gap-3 py-1.5">
      <input
        id={boxId}
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={(event) => onToggle(event.target.checked)}
      />
      <label
        htmlFor={boxId}
        aria-hidden
        className={cn(
          "flex size-[1.3125rem] shrink-0 cursor-pointer items-center justify-center rounded-tag border transition",
          checked ? "border-ink bg-ink text-white" : "border-line bg-card text-transparent",
        )}
      >
        <Check className="text-[0.75rem]" />
      </label>

      <label htmlFor={boxId} className="flex-1 cursor-pointer text-[0.8125rem] text-ink-2">
        {prefix} {item.title} 동의
      </label>

      <Link
        href={detailHref}
        aria-label={`${item.title} 상세보기`}
        className="flex size-6 shrink-0 items-center justify-center rounded-chip text-ink-3 transition hover:bg-paper hover:text-ink"
      >
        <ChevronRight className="text-[0.9rem]" />
      </Link>
    </div>
  );
}
