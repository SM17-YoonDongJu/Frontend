export interface DateDividerProps {
  /** 표시 라벨(예 "2026.05.21") — 파생 로직이 생성 */
  label: string;
}

export function DateDivider({ label }: DateDividerProps) {
  return (
    <div className="flex justify-center py-1">
      {/* Figma — 모바일 맨 텍스트(663:3817) · 데스크톱 pill(95:4619) */}
      <span className="text-[0.71875rem] text-ink-3 md:rounded-full md:border md:border-line-2 md:bg-card md:px-3.5 md:py-1 md:text-[0.675rem]">
        {label}
      </span>
    </div>
  );
}
