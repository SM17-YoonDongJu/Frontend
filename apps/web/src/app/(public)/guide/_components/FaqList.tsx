import { ChevronDown } from "@/shared/ui/icons/ChevronDown";
import { SectionHeading } from "../../_shared/_components/SectionHeading";
import { FAQ_ITEMS } from "../_model/content";

export function FaqList() {
  return (
    <section id="faq" className="scroll-mt-20 border-y border-line-2 bg-paper-2 py-16 md:py-20">
      <div className="mx-auto w-full max-w-[52rem] px-6 md:px-14">
        <SectionHeading kicker="자주 묻는 질문" title="궁금한 점을 모았어요" />

        <ul className="mt-10 space-y-3">
          {FAQ_ITEMS.map((item) => (
            <li key={item.question}>
              <details className="group rounded-card border border-line bg-card px-6 [&[open]]:pb-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[1rem] font-bold text-ink marker:hidden [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <ChevronDown className="size-5 shrink-0 text-ink-3 transition group-open:rotate-180" />
                </summary>
                <p className="text-[0.9375rem] leading-[1.6] text-ink-2">{item.answer}</p>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
