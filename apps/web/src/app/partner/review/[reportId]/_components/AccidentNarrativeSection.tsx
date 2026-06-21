export interface AccidentNarrativeSectionProps {
  description: string | null;
}

export function AccidentNarrativeSection({ description }: AccidentNarrativeSectionProps) {
  if (!description) return null;

  return (
    <div>
      <p className="text-[13px] font-bold text-ink">의뢰인이 작성한 사고 경위</p>
      <div className="mt-2 rounded-card border border-line bg-paper-2 p-4">
        <p className="text-[14px] leading-relaxed text-ink-2">{description}</p>
      </div>
    </div>
  );
}
