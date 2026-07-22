import { Check } from "@/shared/ui/icons/Check";
import { SectionHeading } from "../../_shared/_components/SectionHeading";
import { TRUST_ITEMS } from "../_model/content";

export function TrustSection() {
  return (
    <section className="mx-auto w-full max-w-[80rem] px-6 py-16 md:px-14 md:py-20">
      <SectionHeading kicker="믿을 수 있는 이유" title="검증된 절차로 진행합니다" />

      <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        {TRUST_ITEMS.map((item) => (
          <li
            key={item.title}
            className="flex gap-4 rounded-card border border-line bg-card p-6"
          >
            <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-green-soft text-green">
              <Check className="size-[1rem]" />
            </span>
            <div>
              <h3 className="text-[1.0625rem] font-bold text-ink">{item.title}</h3>
              <p className="mt-1.5 break-keep text-[0.875rem] leading-[1.6] text-ink-2">{item.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
