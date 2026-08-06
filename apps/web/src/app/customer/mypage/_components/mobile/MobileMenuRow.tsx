import Link from "next/link";
import type { ReactNode } from "react";
import { MobileMenuRowInner } from "./MobileMenuRowInner";

interface MobileMenuRowProps {
  icon: ReactNode;
  label: string;
  right?: ReactNode;
  href?: string;
  onClick?: () => void;
}

const ROW_CLASS =
  "flex w-full items-center gap-3 px-1 py-3.5 text-left transition hover:bg-paper-2";

/** 모바일 리스트 행(좌 아이콘 + 라벨 + 우측 값/배지 + chevron). href 있으면 링크, 없으면 버튼. */
export function MobileMenuRow({
  icon,
  label,
  right,
  href,
  onClick,
}: MobileMenuRowProps) {
  if (href) {
    return (
      <Link href={href} className={ROW_CLASS}>
        <MobileMenuRowInner icon={icon} label={label} right={right} />
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={ROW_CLASS}>
      <MobileMenuRowInner icon={icon} label={label} right={right} />
    </button>
  );
}
