interface SectionHeadingProps {
  kicker: string;
  title: string;
}

/**
 * 섹션 상단 반복 헤딩. 중앙정렬 kicker(gold-ink) + serif 제목.
 */
export function SectionHeading({ kicker, title }: SectionHeadingProps) {
  return (
    <div className="text-center">
      <p className="text-[0.875rem] font-bold text-gold-ink">{kicker}</p>
      <h2 className="mt-[0.8125rem] font-serif text-[1.75rem] font-bold text-ink md:text-[2.375rem]">
        {title}
      </h2>
    </div>
  );
}
