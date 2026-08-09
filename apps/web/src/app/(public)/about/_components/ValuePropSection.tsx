import { SectionHeading } from "../../_shared/_components/SectionHeading";
import { VALUE_ITEMS } from "../_model/content";

export function ValuePropSection() {
  return (
    <section className="border-y border-line-2 bg-paper-2 py-16 md:py-20">
      <div className="mx-auto w-full max-w-[80rem] px-6 md:px-14">
        <SectionHeading kicker="바른보상이 하는 일" title="AI 분석과 전문가 검수, 두 단계로" />

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {VALUE_ITEMS.map((item, index) => (
            <div key={item.title} className="rounded-card border border-line bg-card p-8">
              <p className="font-serif text-[0.875rem] font-bold text-gold-ink">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 text-[1.25rem] font-bold text-ink">{item.title}</h3>
              <p className="mt-3 break-keep text-[0.9375rem] leading-[1.6] text-ink-2">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
