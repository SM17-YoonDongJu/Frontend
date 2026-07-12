import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "@/shared/ui/icons/ChevronRight";

interface MobileMenuRowProps {
  icon: ReactNode;
  label: string;
  right?: ReactNode;
  href?: string;
}

const ROW_CLASS =
  "flex w-full items-center gap-3 px-1 py-3.5 text-left transition hover:bg-paper-2";

function RowInner({ icon, label, right }: Omit<MobileMenuRowProps, "href">) {
  return (
    <>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-paper-2 text-ink-2">
        {icon}
      </span>
      <span className="flex-1 text-[0.9375rem] font-medium text-ink">{label}</span>
      {right}
      <ChevronRight className="size-4 shrink-0 text-ink-3" />
    </>
  );
}

/** 모바일 리스트 행(좌 아이콘 + 라벨 + 우측 값/배지 + chevron). href 있으면 링크, 없으면 버튼. */
export function MobileMenuRow({ icon, label, right, href }: MobileMenuRowProps) {
  if (href) {
    return (
      <Link href={href} className={ROW_CLASS}>
        <RowInner icon={icon} label={label} right={right} />
      </Link>
    );
  }
  return (
    <button type="button" className={ROW_CLASS}>
      <RowInner icon={icon} label={label} right={right} />
    </button>
  );
}
