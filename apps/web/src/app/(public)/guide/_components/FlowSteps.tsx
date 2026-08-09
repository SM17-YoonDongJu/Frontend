import type { ComponentType } from "react";
import { CheckCircle } from "@/shared/ui/icons/CheckCircle";
import { FileText } from "@/shared/ui/icons/FileText";
import { MessageCircle } from "@/shared/ui/icons/MessageCircle";
import { Upload } from "@/shared/ui/icons/Upload";
import { SectionHeading } from "../../_shared/_components/SectionHeading";
import { FLOW_STEPS, type FlowIconName } from "../_model/content";

const ICONS: Record<FlowIconName, ComponentType<{ className?: string }>> = {
  upload: Upload,
  fileText: FileText,
  checkCircle: CheckCircle,
  messageCircle: MessageCircle
};

export function FlowSteps() {
  const last = FLOW_STEPS.length - 1;

  return (
    <section className="mx-auto w-full max-w-[80rem] px-6 py-16 md:px-14 md:py-20">
      <SectionHeading kicker="이용 흐름" title="이렇게 진행됩니다" />

      <ol className="mt-12 grid grid-cols-1 gap-y-10 lg:grid-cols-4 lg:gap-x-10">
        {FLOW_STEPS.map((step, index) => {
          const Icon = ICONS[step.iconName];
          return (
            <li key={step.no} className="flex gap-5 lg:block">
              <div className="flex flex-col items-center lg:hidden">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-navy text-white">
                  <Icon className="size-5" />
                </span>
                {index < last && <span aria-hidden className="mt-3 w-px flex-1 bg-gold/45" />}
              </div>

              <div className="relative hidden lg:block">
                {index < last && (
                  <span
                    aria-hidden
                    className="absolute left-[3.75rem] right-[-2.5rem] top-6 h-px bg-gold/45"
                  />
                )}
                <span className="flex size-12 items-center justify-center rounded-full bg-navy text-white">
                  <Icon className="size-5" />
                </span>
              </div>

              <div className="pb-2 lg:pb-0">
                <p className="font-serif text-[0.875rem] font-bold text-gold-ink lg:mt-6">
                  {step.no}
                </p>
                <h3 className="mt-1.5 break-keep text-[1.0625rem] font-bold leading-snug text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-[17rem] break-keep text-[0.875rem] leading-[1.7] text-ink-2 [overflow-wrap:break-word]">
                  {step.body}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
