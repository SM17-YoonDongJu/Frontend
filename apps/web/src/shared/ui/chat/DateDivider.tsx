export interface DateDividerProps {
  /** 표시 라벨(예 "2026.05.21") — 파생 로직이 생성 */
  label: string;
}

export function DateDivider({ label }: DateDividerProps) {
  return (
    <div className="flex justify-center py-1">
      <span className="text-[0.71875rem] text-ink-3">{label}</span>
    </div>
  );
}
